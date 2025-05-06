"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import BookingModal from "./modal/BookingModal";
import { FileText } from "phosphor-react";

interface TravelPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  pdfUrl: string;
  maxPeople: number;
  boardingLocations: string[];
  travelMonth: string;
  travelDate: string | null;
  returnDate: string | null;
  travelTime: string | null;
  imageUrl?: string;
  created_at: string;
  updated_at: string;
}

interface TravelGridProps {
  searchParams: {
    destination: string;
    month: string;
  };
}

const TravelGrid = ({ searchParams }: TravelGridProps) => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Novo estado para controlar a paginação
  const [visiblePackages, setVisiblePackages] = useState(9); // Inicialmente mostra 9 pacotes
  const packagesPerLoad = 3; // Carrega 3 pacotes por vez ao clicar em "Ver mais"

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get("https://vandre-backend.vercel.app/api/travel-packages");
        setPackages(response.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Não foi possível carregar os pacotes. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    setVisiblePackages(9);
  }, [searchParams]);

  const filteredPackages = packages.filter((item) => {
    const matchesDestination =
      !searchParams.destination ||
      item.name.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
      item.description.toLowerCase().includes(searchParams.destination.toLowerCase());
      
    const matchesMonth =
      !searchParams.month ||
      searchParams.month === "all" ||
      item.travelMonth.toLowerCase().includes(searchParams.month.toLowerCase());
      
    return matchesDestination && matchesMonth;
  });

  const handleBookClick = (travelPackage: TravelPackage) => {
    setSelectedPackage(travelPackage);
    setIsModalOpen(true);
  };

  const handleOpenPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Data não definida";
    return date;
  };

  const formatTravelPeriod = (departureDate: string | null, returnDate: string | null, time: string | null) => {
    if (!departureDate) return "Data não definida";
    
    let formattedPeriod = `Ida: ${departureDate}`;
    
    if (time) {
      formattedPeriod += ` às ${time}`;
    }
    
    if (returnDate) {
      formattedPeriod += ` | Volta: ${returnDate}`;
    }
    
    return formattedPeriod;
  };

  // Função para carregar mais pacotes
  const loadMorePackages = () => {
    setVisiblePackages(prevVisible => prevVisible + packagesPerLoad);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Carregando pacotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-50 p-4 rounded-lg inline-block">
          <p className="text-red-600">{error}</p>
          <Button 
            className="mt-4 bg-blue-500 hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (filteredPackages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Nenhum pacote encontrado com os filtros selecionados.</p>
      </div>
    );
  }

  // Limita o número de pacotes visíveis
  const visibleFilteredPackages = filteredPackages.slice(0, visiblePackages);
  
  // Verifica se há mais pacotes para mostrar
  const hasMorePackages = visiblePackages < filteredPackages.length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleFilteredPackages.map((item) => (
          <div key={item.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg">
            {item.imageUrl ? (
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                width={400} 
                height={250} 
                className="w-full h-48 object-cover rounded-t-2xl" 
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center">
                <span className="text-gray-400">Imagem indisponível</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">{item.name}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">
                  {formatTravelPeriod(item.travelDate, item.returnDate, item.travelTime)}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">{item.travelMonth}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">A partir de</p>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(item.price)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenPdf(item.pdfUrl)}
                    className="flex items-center gap-1 text-xs py-1 h-8 flex-1 sm:flex-auto"
                  >
                    <FileText size={14} />
                    <span className="hidden sm:inline md:hidden">Info..</span>
                    <span className="inline sm:hidden md:inline">Informações</span>
                  </Button>
                  
                  <Button 
                    className="text-white rounded-xl bg-blue-500 hover:bg-blue-600 text-xs py-1 h-8 flex-1 sm:flex-auto"
                    onClick={() => handleBookClick(item)}
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botão "Ver mais" */}
      {hasMorePackages && (
        <div className="mt-12 text-center">
          <Button 
            onClick={loadMorePackages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transform transition-all duration-300 hover:scale-105"
          >
            Ver mais pacotes
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      )}
      
      {selectedPackage && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          travelPackage={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            pdfUrl: selectedPackage.pdfUrl,
            boardingLocations: selectedPackage.boardingLocations.flatMap(loc => 
              loc.split(',')
            )
          }}
        />
      )}
    </div>
  );
};

export default TravelGrid;