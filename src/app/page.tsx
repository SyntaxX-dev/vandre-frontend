"use client"

import { MagnifyingGlass } from "phosphor-react";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState, useRef, useEffect, useCallback } from "react";

import { debounce } from "lodash";

import CarouselBanner from "@/components/carrossel/CarouselBanner";
import SearchInput from "@/components/search/SearchInput";
import TravelGrid from "@/components/TravelGrid";
import axios from "axios";
import Image from "next/image";
import Logo_branco from "../../public/images/logo-vandre-branca.svg";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [searchParams, setSearchParams] = useState({ destination: "", month: "" });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  
  const topRef = useRef<HTMLDivElement>(null);
  const pacotesRef = useRef<HTMLDivElement>(null);
  const contatoRef = useRef<HTMLDivElement>(null);

  const [footerDestinations, setFooterDestinations] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("https://vandre-backend.vercel.app/api/travel-packages");
        // Get the first 6 destinations or all if less than 6
        const topDestinations = response.data
          .slice(0, 6)
          .map((pkg: any) => ({ id: pkg.id, name: pkg.name }));
        
        setFooterDestinations(topDestinations);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        // Set some fallback destinations in case the API fails
        setFooterDestinations([]);
      }
    };
  
    fetchDestinations();
  }, []);
  
  
  const handleSearch = (params: SetStateAction<{ destination: string; month: string; }>) => {
    setSearchParams(params);
  };

  const handleHeroSearch = () => {
    setSearchParams({ destination: searchInput, month: "" }); // Atualiza os parâmetros de busca
    scrollToSection("pacotes"); // Faz o scroll até a seção de pacotes
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);
  
      // Obtém as posições das seções
      const topSection = topRef.current?.offsetTop || 0;
      const pacotesSection = pacotesRef.current?.offsetTop || 0;
      const contatoSection = contatoRef.current?.offsetTop || 0;
  
      // Define margens para considerar quando uma seção está "ativa"
      const offset = 100; // Ajuste conforme necessário
  
      // Verifica em qual seção o usuário está
      if (scrollY >= contatoSection - offset) {
        setActiveTab("contato");
      } else if (scrollY >= pacotesSection - offset) {
        setActiveTab("pacotes");
      } else if (scrollY >= topSection - offset) {
        setActiveTab("inicio");
      }
    }, 100);
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);
  
  const scrollToSection = useCallback((sectionId: string) => {
    setActiveTab(sectionId);
  
    const scroll = () => {
      if (sectionId === "inicio" && topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (sectionId === "pacotes" && pacotesRef.current) {
        pacotesRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (sectionId === "contato" && contatoRef.current) {
        contatoRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    setTimeout(scroll, 50);
  }, []);
  
  return (
    <div className="flex flex-col font-sans min-h-screen relative">
      <div ref={topRef} className="absolute top-0 left-0 right-0 h-screen z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/photo-1.jpeg')",
            width: "100%",
            height: "100%"
          }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" 
        style={{
          backgroundColor: scrollPosition > 10 || mobileMenuOpen ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
          backdropFilter: scrollPosition > 10 || mobileMenuOpen ? 'blur(8px)' : 'none',
        }}>
        <div className="container mx-auto flex items-center justify-between py-4">

          {/* Logo */}
          <div className="text-2xl font-bold text-white flex items-center">
            <div className="relative flex items-center justify-center">
              {/* Multiple layers for smoky effect */}
              <div className="absolute w-20 h-20 bg-black/10 rounded-full blur-xl"></div>
              <div className="absolute w-18 h-18 bg-black/20 rounded-full blur-lg"></div>
              <div className="absolute w-16 h-16 bg-black/30 rounded-full blur-md"></div>
              <Image width={80} height={80} src={Logo_branco} alt="logo branca" className="relative z-10"/>
            </div>
            <span className="hidden md:inline ml-2">Turma do Vandré</span>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <div className={`${scrollPosition > 10 ? 'bg-white/10' : 'bg-white/10'} backdrop-blur-sm rounded-full p-1 flex relative`}>
              {/* Indicador deslizante que se move para o botão ativo */}
              <div 
                className="absolute bg-white rounded-full transition-[left,width] duration-300 shadow-sm"
                style={{
                  left: activeTab === "inicio" ? "0.45rem" : 
                        activeTab === "pacotes" ? "calc(33.33% + 0.22rem)" : 
                        "calc(66.66% + 0.07em)",
                  width: "calc(33.33% - 0.5rem)",
                  height: "calc(100% - 0.5rem)",
                  top: "0.25rem",
                }}
              />
                            
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/3 ${
                  activeTab !== "inicio" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => scrollToSection("inicio")}
                style={{ color: activeTab === "inicio" ? "black" : "white" }}
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/3 ${
                  activeTab !== "pacotes" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => scrollToSection("pacotes")}
                style={{ color: activeTab === "pacotes" ? "black" : "white" }}
              >
                Pacotes
              </Button>
              <Button 
                variant="ghost" 
                className={`px-5 py-1 text-sm rounded-full transition-colors duration-300 z-10 w-1/3 ${
                  activeTab !== "contato" ? "hover:bg-white/20" : ""
                }`}
                onClick={() => scrollToSection("contato")}
                style={{ color: activeTab === "contato" ? "black" : "white" }}
              >
                Contato
              </Button>
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white mr-2 p-3"
            >
              {mobileMenuOpen ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="white"
                  className="!w-8 !h-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="white"
                  className="!w-8 !h-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </Button>
          </div>

          {/* CTA Button */}
          <Button 
            asChild
            className="rounded-full hidden md:flex bg-gray-600 hover:bg-gray-600 text-white font-semibold px-6 py-2 shadow-lg transform transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <a 
              href="https://wa.me/5511948007051?text=Olá!%20Gostaria%20de%20planejar%20minha%20viagem%20com%20a%20Turma%20do%20Vandré.%20Pode%20me%20ajudar?" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Planejar a sua viagem
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-max-height duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-4 bg-black/20 backdrop-blur-md rounded-lg mb-4">
            <div className="flex flex-col space-y-3">
              <button 
                className={`text-left py-2 px-4 rounded-lg ${activeTab === 'inicio' ? 'bg-white/20 text-white font-medium' : 'text-white'}`}
                onClick={() => scrollToSection("inicio")}
              >
                Início
              </button>
              <button 
                className={`text-left py-2 px-4 rounded-lg ${activeTab === 'pacotes' ? 'bg-white/20 text-white font-medium' : 'text-white'}`}
                onClick={() => scrollToSection("pacotes")}
              >
                Pacotes
              </button>
              <button 
                className={`text-left py-2 px-4 rounded-lg ${activeTab === 'contato' ? 'bg-white/20 text-white font-medium' : 'text-white'}`}
                onClick={() => scrollToSection("contato")}
              >
                Contato
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[58rem] md:h-screen z-10 container mx-auto">
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white uppercase tracking-widest text-sm md:text-base mb-2">Agência de Turismo</p>
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-4">
            Turma do Vandré
          </h1>
          <p className="text-white text-sm md:text-base max-w-2xl mb-8">
            Experimente a magia de explorar os destinos mais deslumbrantes do mundo 
            com os nossos pacotes de viagens personalizados para todos os aventureiros.
          </p>

          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-lg">
            <CardContent className="p-1 flex flex-wrap md:flex-nowrap items-center">
              <div className="flex-grow pr-2 outline-none">
                <input 
                  type="text" 
                  placeholder="Para onde você quer ir?" 
                  className="w-full border-none outline-none text-base py-2 px-4 bg-transparent"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="p-2 flex items-center">
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 py-6 flex items-center justify-center h-10 transition-all duration-500 ease-in-out transform"
                  onClick={handleHeroSearch}
                >
                  <span className="hidden sm:flex text-white">Encontrar viagem</span>
                  <MagnifyingGlass className="w-4 h-4 mx-1 sm:mx-0 sm:ml-2 text-white" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-8 md:mb-0 px-4 sm:px-20 md:px-28 mt-8 md:mt-12">
        <CarouselBanner />
      </div>

      {/*Pacotes Partners Section */}
      <div ref={pacotesRef} className="py-12 relative z-10 bg-gray-50">
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

      <GoogleReviewsSection />

      {/* WhatsApp Contact Section */}
      <div ref={contatoRef} className="py-32 bg-gray-50 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-8 bg-white rounded-2xl shadow-md">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">Fale com a Turma do Vandré</h2>
              <p className="text-gray-700 mb-6">
                Converse diretamente com nossa equipe de especialistas para planejar a viagem dos seus sonhos.
                Estamos prontos para ajudar você a encontrar os destinos inesquecíveis que combinam com o seu estilo.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600 mr-2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>Atendimento personalizado</span>
                </div>
                <div className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600 mr-2">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Resposta rápida</span>
                </div>
                <div className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600 mr-2">
                    <path d="M2 17h20v2H2v-2zm1.15-8.05c.34-.9 1.3-1.5 2.35-1.5.26 0 .5.03.74.08.7-.72 1.67-1.18 2.76-1.18 1.68 0 3.1 1.09 3.63 2.6 1 .06 1.94.47 2.66 1.12.34-.04.69-.06 1.05-.06 1.78 0 3.4.78 4.5 2H1.39c.39-1.37 1.06-2.44 1.76-3.06z" />
                  </svg>
                  <span>Pacotes sob medida</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <a 
                href="https://wa.me/5511948007051?text=Olá!%20Estou%20interessado%20em%20planejar%20uma%20viagem%20com%20a%20Turma%20do%20Vandré.%20Pode%20me%20ajudar?" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 px-6 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre Nós Section - Add this below the WhatsApp Contact Section */}
      <div className="py-24 relative overflow-hidden mb-32">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: "url('/images/fundo-vandre-preto.svg')",
              width: "100%",
              height: "100%"
            }}
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Logo Section */}
            <div className="md:w-1/3 flex justify-center">
              <div className="relative transform transition duration-500 hover:scale-105">
                <Image 
                  src="/images/logo-vandre-colorido-st.svg" 
                  alt="Turma do Vandré Logo" 
                  width={300} 
                  height={300}
                  className="drop-shadow-xl"
                />
              </div>
            </div>

            {/* About Section */}
            <div className="md:w-2/3 text-white px-6 md:px-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">Sobre a Turma do Vandré</h2>
              
              <div className="space-y-4 max-w-2xl">
                <p className="text-gray-200">
                  Somos uma agência de turismo apaixonada por criar experiências de viagens inesquecíveis. Desde 2010, conectamos pessoas a destinos extraordinários com pacotes personalizados que atendem a todos os estilos de viajantes.
                </p>
                
                <p className="text-gray-200">
                  Nossa missão é proporcionar momentos únicos através de roteiros cuidadosamente planejados, com atendimento personalizado e compromisso com a satisfação de nossos clientes.
                </p>
                
                <p className="text-gray-200">
                  Com a Turma do Vandré, sua viagem começa muito antes do embarque - começa no momento em que você sonha com seu próximo destino.
                </p>
                
                <div className="pt-6">
                  <Button 
                    asChild
                    className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <a 
                      href="https://www.instagram.com/turmadovandre/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Conheça nossa história
                      <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white pt-16 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          {/* Footer Top Section with columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Logo and about */}
            <div className="md:col-span-1">
              <div className="text-2xl font-bold flex items-center mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Turma do Vandré
              </div>
              <p className="text-blue-200 mb-6">
                Criando experiências inesquecíveis e conectando pessoas a destinos extraordinários desde 2010.
              </p>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/turmadovandre/?locale=pt_BR&_rdc=1&_rdr#" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/turmadovandre/" className="text-white hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <button 
                    onClick={() => scrollToSection("inicio")} 
                    className="hover:text-white transition-colors text-blue-200 text-left"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("pacotes")} 
                    className="hover:text-white transition-colors text-blue-200 text-left"
                  >
                    Pacotes
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("contato")} 
                    className="hover:text-white transition-colors text-blue-200 text-left"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Destinos */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Destinos</h3>
              <ul className="space-y-2 text-blue-200">
                {footerDestinations.length > 0 ? (
                  footerDestinations.map((destination) => (
                    <li key={destination.id}>
                      <button
                        onClick={() => {
                          // Set search params to filter packages by this destination
                          setSearchParams({ destination: destination.name, month: "" });
                          // Scroll to the packages section
                          scrollToSection("pacotes");
                        }}
                        className="hover:text-white transition-colors text-blue-200 text-left"
                      >
                        {destination.name}
                      </button>
                    </li>
                  ))
                ) : (
                  // Fallback items if no destinations are loaded
                  <>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Pacotes Nacionais</button></li>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Pacotes Internacionais</button></li>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Praias</button></li>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Montanhas</button></li>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Cidades Históricas</button></li>
                    <li><button onClick={() => scrollToSection("pacotes")} className="hover:text-white transition-colors text-blue-200 text-left">Aventura</button></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3 mt-1 text-blue-300">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="text-blue-200">Rua Capitão Alberto Graff 129<br />Centro/Caieiras - SP</span>

                </li>
                <li className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3 text-blue-300">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-blue-200">(11) 4605-0203</span>
                    <span className="text-blue-200">(11) 94800-7051</span>
                    <span className="text-blue-200">(11) 97373-9350</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3 text-blue-300">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="text-blue-200 lg:text-xs xl:text-base">atendimento@turmadovandre.com.br</span>
                </li>
                <li className="flex items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3 text-blue-300">
                    <path d="M12 0C7.11 0 3.4 1.96 3.4 4.2v15.6c0 2.24 3.71 4.2 8.6 4.2s8.6-1.96 8.6-4.2V4.2c0-2.24-3.71-4.2-8.6-4.2zm0 24c-5.17 0-9.6-2.09-9.6-4.8V6.79c1.96 1.66 5.37 2.81 9.6 2.81s7.64-1.15 9.6-2.81v12.41c0 2.71-4.43 4.8-9.6 4.8zm0-18c-5.17 0-9.6-2.09-9.6-4.8S6.83 1.2 12 1.2s9.6 2.09 9.6 4.8S17.17 6 12 6z" />
                  </svg>
                  <span className="text-blue-200">CNPJ: 40.714.437/0001-01</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright and Bottom Links */}
          <div className="border-t border-blue-800 pt-8 mt-8 text-sm text-blue-300 md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Turma do Vandré. Todos os direitos reservados.
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-white transition-colors">Políticas de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
