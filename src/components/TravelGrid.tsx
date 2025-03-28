"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
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
  // CORREÇÃO IMPORTANTE: Separar dados originais dos dados filtrados
  const [allTravelPackages, setAllTravelPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  // Função para carregar os dados da API
  const fetchTravelPackages = async () => {
    try {
      setLoading(true);
      // Usando o proxy configurado no next.config.js para evitar CORS
      const response = await axios.get('/api/travel-packages');
      const data = response.data;
      
      setAllTravelPackages(data);
      setFilteredPackages(data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar pacotes de viagem:", err);
      setError("Não foi possível carregar os pacotes de viagem. Por favor, tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Função para filtrar os pacotes de viagem usando useCallback
  const filterTravelPackages = useCallback(() => {
    const { destination, month } = searchParams;
    
    let results = [...allTravelPackages];
    
    // Filtrar por destino (se especificado)
    if (destination && destination.trim() !== "") {
      const searchTerm = destination.toLowerCase().trim();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por mês (se especificado)
    if (month && month.trim() !== "") {
      const monthMap: Record<string, string> = {
        "jan": "Janeiro",
        "fev": "Fevereiro",
        "mar": "Março",
        "abr": "Abril",
        "mai": "Maio",
        "jun": "Junho",
        "jul": "Julho",
        "ago": "Agosto",
        "set": "Setembro",
        "out": "Outubro",
        "nov": "Novembro",
        "dez": "Dezembro"
      };
      
      const fullMonth = monthMap[month.toLowerCase()] || month;
      results = results.filter(item => 
        item.travelMonth.toLowerCase() === fullMonth.toLowerCase()
      );
    }
    
    setNoResults(results.length === 0);
    setFilteredPackages(results); // CORREÇÃO: Atualizar os filtrados, não os originais
  }, [searchParams, allTravelPackages]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchTravelPackages();
  }, []);

  // Filtrar dados quando os parâmetros de busca mudarem
  useEffect(() => {
    if (allTravelPackages.length > 0) {
      filterTravelPackages();
    }
  }, [allTravelPackages, filterTravelPackages]);

  // Função para calcular os dias restantes até a viagem
  const getDaysUntilTravel = (travelDate: string | null): string | null => {
    if (!travelDate) return null;
    
    try {
      // Simplificação do parsing de data para evitar problemas
      const fixedDate = travelDate.replace(/^(\d{3})\//, '$1');
      
      // Tentar interpretar diferentes formatos de data
      let dateObj: Date | null = null;
      const formats = ['dd/MM/yyyy', 'yyyy-MM-dd', 'd/MM/yyyy'];
      
      for (const format of formats) {
        const parsedDate = parse(fixedDate, format, new Date());
        if (isValid(parsedDate)) {
          dateObj = parsedDate;
          break;
        }
      }
      
      // Se não conseguimos analisar a data, retornar null
      if (!dateObj || !isValid(dateObj)) return null;
      
      const today = new Date();
      const daysLeft = differenceInDays(dateObj, today);
      
      // Retornar apenas se for menos de 30 dias
      if (daysLeft > 0 && daysLeft <= 30) {
        return `${daysLeft} dias`;
      }
    } catch (e) {
      console.error("Erro ao processar data:", e);
    }
    
    return null;
  };

  // Função para tratar o clique no botão reservar
  const handleReserveClick = (travelPackage: TravelPackage) => {
    setSelectedPackage(travelPackage);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  // Função para obter o nome completo do mês
  const getMonthLabel = (monthCode: string): string => {
    const months: Record<string, string> = {
      "Janeiro": "Janeiro",
      "Fevereiro": "Fevereiro",
      "Março": "Março",
      "Abril": "Abril",
      "Maio": "Maio",
      "Junho": "Junho",
      "Julho": "Julho",
      "Agosto": "Agosto",
      "Setembro": "Setembro",
      "Outubro": "Outubro",
      "Novembro": "Novembro",
      "Dezembro": "Dezembro"
    };
    return months[monthCode] || monthCode;
  };

  // Função para renderizar a mensagem de busca
  const renderSearchMessage = () => {
    const { destination, month } = searchParams;
    
    let message = "Não encontramos resultados";
    
    if (destination && month) {
      message += ` para "${destination}" em ${getMonthLabel(month)}`;
    } else if (destination) {
      message += ` para "${destination}"`;
    } else if (month) {
      message += ` para o mês de ${getMonthLabel(month)}`;
    }
    
    return message + ". Por favor, tente outra pesquisa.";
  };

  // Mostrar estado de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mostrar mensagem de erro
  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-red-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => fetchTravelPackages()} 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {noResults ? (
        <div className="text-center py-12 px-4">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600 mb-6">{renderSearchMessage()}</p>
            <Button 
              onClick={() => {
                // CORREÇÃO: Definir corretamente os filtrados como os originais
                setFilteredPackages(allTravelPackages);
                setNoResults(false);
              }} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
            >
              Ver todas as viagens
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((item) => { // CORREÇÃO: Usar os dados filtrados
            const daysUntilTravel = getDaysUntilTravel(item.travelDate);
            
            return (
              <div 
                key={item.id} 
                className="relative bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <Image 
                    src={`https://vandre-backend.vercel.app${item.imageUrl}`}
                    alt={item.name} 
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  {daysUntilTravel && (
                    <div className="absolute bottom-3 left-3 bg-red-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                      Faltam {daysUntilTravel}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span 
                        className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600"
                      >
                        {getMonthLabel(item.travelMonth)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500">A partir de</span>
                      <p className="text-xl font-bold"><span className="font-medium text-sm">R$</span> {item.price.toLocaleString('pt-BR')}</p>
                    </div>
                    <Button 
                      className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleReserveClick(item)}
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Modal de Reserva */}
      {selectedPackage && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          travelPackage={selectedPackage}
        />
      )}
    </div>
  );
};

export default TravelGrid;
