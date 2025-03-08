"use client"

import { MagnifyingGlass } from "phosphor-react";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState } from "react";

import CarouselBanner from "@/components/carrossel/CarouselBanner";
import SearchInput from "@/components/search/SearchInput";
import TravelGrid from "@/components/TravelGrid";

export default function Home() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [searchParams, setSearchParams] = useState({ destination: "", month: "" });
  
  const handleSearch = (params: SetStateAction<{ destination: string; month: string; }>) => {
    setSearchParams(params);
  };
  
  return (
    <div className="flex flex-col font-sans min-h-screen relative">
      {/* Background Image - Covers only navbar and hero section */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/vanTest.jpeg')",
            width: "100%",
            height: "100%"
          }}
        />
        {/* Semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    
      {/* Navigation Bar */}
      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-white flex items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Turma do Vandré
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex relative">
              {/* Indicador deslizante que se move para o botão ativo */}
              <div 
                className="absolute bg-white rounded-full transition-all duration-300 shadow-sm"
                style={{
                  left: activeTab === "inicio" ? "0.45rem" : 
                        activeTab === "destinos" ? "calc(25% + 0.33rem)" : 
                        activeTab === "pacotes" ? "calc(50% + 0.22rem)" : 
                        "calc(75% + 0.07em)",
                  width: "calc(25% - 0.5rem)",
                  height: "calc(100% - 0.5rem)",
                  top: "0.25rem",
                }}
              />
              
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/4 ${
                  activeTab !== "inicio" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => setActiveTab("inicio")}
                style={{ color: activeTab === "inicio" ? "black" : "white" }}
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/4 ${
                  activeTab !== "destinos" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => setActiveTab("destinos")}
                style={{ color: activeTab === "destinos" ? "black" : "white" }}
              >
                Destinos
              </Button>
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/4 ${
                  activeTab !== "pacotes" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => setActiveTab("pacotes")}
                style={{ color: activeTab === "pacotes" ? "black" : "white" }}
              >
                Pacotes
              </Button>
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/4 ${
                  activeTab !== "contato" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => setActiveTab("contato")}
                style={{ color: activeTab === "contato" ? "black" : "white" }}
              >
                Contato
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <Button className="rounded-full" size="sm">
            Planejar a sua viagem
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-screen z-10 container mx-auto">
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white uppercase tracking-widest text-sm md:text-base mb-2">Agência de Turismo</p>
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-4">
            Turma do Vandré
          </h1>
          <p className="text-white text-sm md:text-base max-w-2xl mb-8">
            Experimente a magia de explorar os destinos mais deslumbrantes do mundo 
            com os nossos pacotes de viagem personalizados para todos os aventureiros.
          </p>

          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-lg">
            <CardContent className="p-1 flex flex-wrap md:flex-nowrap items-center">
              <div className="flex-grow pr-2 outline-none">
                <input 
                  type="text" 
                  placeholder="Para onde você quer ir?" 
                  className="w-full border-none outline-none text-base py-2 px-4"
                />
              </div>
              <div className="p-2 flex items-center">
                <Button className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 py-6 flex items-center justify-center h-10">
                  Encontrar viagem
                  <MagnifyingGlass className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="px-28">
        <CarouselBanner />
      </div>

      {/* Partners Section */}
      <div className="py-12 relative z-10 bg-gray-50">
        <div className="container mx-auto">
          <div className="px-4">
            <h2 className="text-3xl font-bold text-left mb-8">Nossos Destinos Exclusivos</h2>
            <div className="mb-8">
              <SearchInput onSearch={handleSearch} />
            </div>
            
            <TravelGrid searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}