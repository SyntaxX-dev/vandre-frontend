"use client";

import { useState } from "react";
import { Calendar, MapPin, X } from "lucide-react";
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
  const [month, setMonth] = useState("all"); // Estado padrão definido como "Todos"

  const handleSearch = () => {
    onSearch({ destination, month });
  };

  const handleReset = () => {
    setDestination(""); // Redefine o campo de destino
    setMonth("all"); // Redefine o campo de mês para "Todos"
    onSearch({ destination: "", month: "all" }); // Chama a busca com valores redefinidos
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-center bg-white rounded-2xl md:rounded-full shadow-md px-2 py-4 md:py-0 w-full max-w-5xl">
      <div className="flex w-[80%] md:w-0 items-center space-x-2 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 p-2 md:pl-2">
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

      <div className="flex w-[80%] md:w-0 items-center space-x-2 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-gray-200 p-2 md:pr-2">
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

      <div className="flex items-center space-x-2 px-12 md:px-4 w-full md:w-auto">
        <Button 
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white rounded-xl md:rounded-full px-6 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={handleSearch}
        >
          Buscar
        </Button>
        <Button
          variant="destructive"
          className="w-full md:w-auto rounded-xl md:rounded-full px-6 py-2 bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          onClick={handleReset}
        >
          Redefinir
        </Button>
      </div>
    </div>
  );
};

export default SearchInput;