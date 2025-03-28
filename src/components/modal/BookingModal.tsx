"use client";

import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { FileText } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelPackage: {
    id: string;
    name: string;
    pdfUrl: string;
    boardingLocations: string[];
  };
}

interface BookingFormData {
  travelPackageId: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  boardingLocation: string;
}

const BookingModal = ({ isOpen, onClose, travelPackage }: BookingModalProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState<BookingFormData>({
    travelPackageId: travelPackage.id,
    fullName: "",
    rg: "",
    cpf: "",
    birthDate: "",
    phone: "",
    email: "",
    boardingLocation: travelPackage.boardingLocations[0] || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBoardingLocationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      boardingLocation: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        birthDate: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://vandre-backend.vercel.app/api/bookings",
        formData
      );
      
      if (response.status === 201) {
        setSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setSuccess(false);
          onClose();
          setFormData({
            travelPackageId: travelPackage.id,
            fullName: "",
            rg: "",
            cpf: "",
            birthDate: "",
            phone: "",
            email: "",
            boardingLocation: travelPackage.boardingLocations[0] || "",
          });
          setDate(undefined);
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Ocorreu um erro ao fazer a reserva. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPdf = () => {
    if (travelPackage.pdfUrl) {
      window.open(travelPackage.pdfUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between mt-4">
            <span>Reserva para {travelPackage.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openPdf}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Ver PDF
            </Button>
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para confirmar a reserva
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="bg-green-50 p-4 rounded-md text-center">
            <h3 className="text-green-800 font-medium mb-2">Reserva realizada com sucesso!</h3>
            <p className="text-green-600">
              Sua reserva foi confirmada. Em breve você receberá mais informações por email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Digite seu email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    placeholder="00.000.000-0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="boardingLocation">Local de embarque</Label>
                  <Select 
                    value={formData.boardingLocation} 
                    onValueChange={handleBoardingLocationChange}
                  >
                    <SelectTrigger id="boardingLocation">
                      <SelectValue placeholder="Selecione um local" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelPackage.boardingLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Confirmar Reserva"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;