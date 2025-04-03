"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import BookingModal from "./modal/BookingModal";

// Update interface to match the actual API response
interface TravelPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  pdfUrl: string;
  maxPeople: number;
  boardingLocations: string[];
  travelMonth: string;  // Different from the original interface
  travelDate: string | null;
  travelTime: string | null;
  imageUrl?: string;  // This is now directly from the API
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

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Update this URL to match your actual API endpoint
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

  // Filter packages based on search parameters
  const filteredPackages = packages.filter((item) => {
    // Assuming "destination" is part of the name or description since it's not in the API
    const matchesDestination =
      !searchParams.destination ||
      item.name.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
      item.description.toLowerCase().includes(searchParams.destination.toLowerCase());
      
    // Updated to use travelMonth instead of month
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

  // Format date and time for display
  const formatDateAndTime = (date: string | null, time: string | null) => {
    if (!date) return "Data não definida";
    // If there's time, append it
    return time ? `${date} às ${time}` : date;
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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((item) => (
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
              
              {/* We don't have a destination field, so either remove this or use another field */}
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">{item.name}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">
                  {formatDateAndTime(item.travelDate, item.travelTime)}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600 text-sm">{item.travelMonth}</span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-gray-500 text-xs">A partir de</p>
                  <p className="text-gray-900 font-bold text-xl">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(item.price)}
                  </p>
                </div>
                
                <Button 
                  className="text-white rounded-xl bg-blue-500 hover:bg-blue-600 px-6 py-2 transition-all duration-500 ease-in-out transform"
                  onClick={() => handleBookClick(item)}
                >
                  Reservar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPackage && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          travelPackage={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            // Adapting the fields to what BookingModal expects
            pdfUrl: selectedPackage.pdfUrl,
            boardingLocations: selectedPackage.boardingLocations.flatMap(loc => 
              loc.split(',') // Split by comma since the API returns a single item with comma-separated values
            )
          }}
        />
      )}
    </div>
  );
};

export default TravelGrid;