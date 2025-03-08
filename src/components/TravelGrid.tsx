"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { travelData } from "@/data/travel-data";

interface SearchParams {
    destination?: string;
    month?: string;
}
  
interface TravelGridProps {
    searchParams: SearchParams;
}

const TravelGrid = ({ searchParams }: TravelGridProps) => {
  const [filteredData, setFilteredData] = useState(travelData);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    filterData(searchParams);
  }, [searchParams]);

  const filterData = (params: SearchParams) => {
    const { destination, month } = params;
    
    let results = [...travelData];
    
    // Filtrar por destino (se especificado)
    if (destination && destination.trim() !== "") {
      const searchTerm = destination.toLowerCase().trim();
      results = results.filter(item => 
        item.location.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por mês (se especificado)
    if (month && month.trim() !== "") {
      results = results.filter(item => item.months.includes(month));
    }
    
    setFilteredData(results);
    setNoResults(results.length === 0);
  };

  const getMonthLabel = (monthCode: string) => {
    const months: Record<string, string> = {
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
    return months[monthCode] || monthCode;
  };

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

  return (
    <div>
      {noResults ? (
        <div className="text-center py-12 px-4">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600 mb-6">{renderSearchMessage()}</p>
            <Button 
              onClick={() => filterData({})} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
            >
              Ver todas as viagens
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.location} 
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute bottom-3 left-3 bg-gray-100/30 text-white/80 rounded-full px-3 py-1 text-xs font-medium">
                  {item.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{item.location}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.months.map(month => (
                      <span 
                        key={`${item.id}-${month}`} 
                        className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600"
                      >
                        {getMonthLabel(month)}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500">A partir de</span>
                    <p className="text-xl font-bold"><span className="font-medium text-sm">R$</span> {item.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white">Reservar</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelGrid;