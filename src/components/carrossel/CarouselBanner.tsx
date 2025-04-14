"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import photo2 from "../../../public/images/photo-2.jpeg";
import photo3 from "../../../public/images/photo-3.jpeg";
import photo4 from "../../../public/images/photo-4.jpeg";

const CarouselBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: photo2,
      title: "Destinos Incríveis",
      description: "Visite os lugares mais deslumbrantes do mundo com pacotes exclusivos"
    },
    {
      id: 2,
      image: photo3,
      title: "Pacotes para Família",
      description: "Crie memórias inesquecíveis com quem você ama em viagens especiais"
    },
    {
      id: 3,
      image: photo4,
      title: "Experiências Únicas",
      description: "Descubra aventuras personalizadas para todos os tipos de viajantes"
    },
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 80000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-96 md:h-[300px] overflow-hidden rounded-2xl">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12">
              <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-white text-base md:text-lg mb-6 max-w-2xl md:w-auto w-[78%]">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-4">
        <Button 
          onClick={prevSlide} 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          onClick={nextSlide} 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeSlide === index 
                ? "bg-white w-8" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselBanner;