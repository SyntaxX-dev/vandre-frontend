"use client";

import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  onSearch: (searchParams: { destination: string; month: string }) => void;
}

const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");

  const handleSearch = () => {
    onSearch({ destination, month });
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-center bg-white rounded-full shadow-md px-2 w-full max-w-5xl">
      <div className="flex items-center space-x-2 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 p-2 md:p-3">
        <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium">Destino</p>
          <Input 
            type="text" 
            placeholder="Para onde você quer ir?" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 p-2 md:p-3">
        <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium">Mês</p>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 h-7 text-sm">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="jan">Janeiro</SelectItem>
              <SelectItem value="fev">Fevereiro</SelectItem>
              <SelectItem value="mar">Março</SelectItem>
              <SelectItem value="abr">Abril</SelectItem>
              <SelectItem value="mai">Maio</SelectItem>
              <SelectItem value="jun">Junho</SelectItem>
              <SelectItem value="jul">Julho</SelectItem>
              <SelectItem value="ago">Agosto</SelectItem>
              <SelectItem value="set">Setembro</SelectItem>
              <SelectItem value="out">Outubro</SelectItem>
              <SelectItem value="nov">Novembro</SelectItem>
              <SelectItem value="dez">Dezembro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-4">
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 ml-auto"
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchInput;