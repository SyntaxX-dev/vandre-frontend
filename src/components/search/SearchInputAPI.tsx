"use client";

import { useState } from "react";
import { MagnifyingGlass } from "phosphor-react";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SearchProps {
  onSearch: (params: { destination: string; month: string }) => void;
}

const SearchInputAPI = ({ onSearch }: SearchProps) => {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");

  const handleSearch = () => {
    onSearch({ destination, month });
  };

  const monthOptions = [
    { value: "", label: "Qualquer mês" },
    { value: "Janeiro", label: "Janeiro" },
    { value: "Fevereiro", label: "Fevereiro" },
    { value: "Março", label: "Março" },
    { value: "Abril", label: "Abril" },
    { value: "Maio", label: "Maio" },
    { value: "Junho", label: "Junho" },
    { value: "Julho", label: "Julho" },
    { value: "Agosto", label: "Agosto" },
    { value: "Setembro", label: "Setembro" },
    { value: "Outubro", label: "Outubro" },
    { value: "Novembro", label: "Novembro" },
    { value: "Dezembro", label: "Dezembro" }
  ];

  return (
    <Card className="bg-white shadow-sm rounded-xl border border-gray-100">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <input
              type="text"
              placeholder="Para onde você quer ir?"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês da viagem</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1 flex items-end">
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={handleSearch}
            >
              <MagnifyingGlass className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInputAPI;