"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { differenceInDays, parse, isValid } from "date-fns";
import BookingModal from "@/components/modal/BookingModal";

interface SearchParams {
  destination?: string;
  month?: string;
}

interface TravelGridProps {
  searchParams: SearchParams;
}

interface TravelPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  pdfUrl: string;
  maxPeople: number;
  boardingLocations: string[];
  travelMonth: string;
  travelDate: string | null;
  travelTime: string | null;
  imageUrl: string;
}

const TravelGrid = ({ searchParams }: TravelGridProps) => {
  const [allTravelPackages, setAllTravelPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  const fetchTravelPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://vandre-backend.vercel.app/api/travel-packages');
      if (!response.ok) throw new Error("Erro ao buscar os pacotes de viagem");
      const data = await response.json();
      setAllTravelPackages(data);
      setFilteredPackages(data);
    } catch (err) {
      console.error("Erro ao carregar pacotes de viagem:", err);
      setError("Não foi possível carregar os pacotes de viagem. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const filterTravelPackages = useCallback(() => {
    const { destination, month } = searchParams;
    let results = [...allTravelPackages];

    if (destination?.trim()) {
      const searchTerm = destination.toLowerCase().trim();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (month?.trim()) {
      const monthMap: Record<string, string> = {
        "jan": "Janeiro", "fev": "Fevereiro", "mar": "Março", "abr": "Abril", 
        "mai": "Maio", "jun": "Junho", "jul": "Julho", "ago": "Agosto", 
        "set": "Setembro", "out": "Outubro", "nov": "Novembro", "dez": "Dezembro"
      };
      const fullMonth = monthMap[month.toLowerCase()] || month;
      results = results.filter(item => item.travelMonth.toLowerCase() === fullMonth.toLowerCase());
    }
    
    setNoResults(results.length === 0);
    setFilteredPackages(results);
  }, [searchParams, allTravelPackages]);

  useEffect(() => {
    fetchTravelPackages();
  }, []);

  useEffect(() => {
    if (allTravelPackages.length > 0) {
      filterTravelPackages();
    }
  }, [allTravelPackages, filterTravelPackages]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 px-4">
          <div className="bg-red-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchTravelPackages} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2">
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : noResults ? (
        <div className="text-center py-12 px-4">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Nenhum resultado encontrado</h3>
            <Button onClick={() => setFilteredPackages(allTravelPackages)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2">
              Ver todas as viagens
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((item) => (
            <div key={item.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-lg">
              <Image src={`https://vandre-backend.vercel.app${item.imageUrl}`} alt={item.name} width={400} height={250} className="w-full h-48 object-cover rounded-t-2xl" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">R$ {item.price.toLocaleString('pt-BR')}</p>
                  <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setSelectedPackage(item); setIsModalOpen(true); }}>
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPackage && <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} travelPackage={selectedPackage} />}
    </div>
  );
};

export default TravelGrid;
