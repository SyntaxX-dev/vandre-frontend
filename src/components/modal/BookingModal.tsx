"use client";

import { useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import { FileText } from "lucide-react";
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
import { API_URL } from "@/api/apiurl";

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
  city: string;
  howDidYouMeetUs: string;
}

const BookingModal = ({ isOpen, onClose, travelPackage }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    travelPackageId: travelPackage.id,
    fullName: "",
    rg: "",
    cpf: "",
    birthDate: "",
    phone: "",
    email: "",
    boardingLocation: travelPackage.boardingLocations?.[0] || "",
    city: "",
    howDidYouMeetUs: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Aplicar máscara para o campo de data de nascimento
    if (name === "birthDate") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "");

      // Aplica a máscara xx/xx/xxxx
      let maskedValue = "";
      if (numericValue.length <= 2) {
        maskedValue = numericValue;
      } else if (numericValue.length <= 4) {
        maskedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
      } else {
        maskedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
      return;
    }

    // Aplicar máscara para o campo CPF
    if (name === "cpf") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "");

      // Aplica a máscara 000.000.000-00
      let maskedValue = "";
      if (numericValue.length <= 3) {
        maskedValue = numericValue;
      } else if (numericValue.length <= 6) {
        maskedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
      } else if (numericValue.length <= 9) {
        maskedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`;
      } else {
        maskedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
      return;
    }

    // Aplicar máscara para o campo RG
    if (name === "rg") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "");

      // Aplica a máscara 00.000.000-0
      let maskedValue = "";
      if (numericValue.length <= 2) {
        maskedValue = numericValue;
      } else if (numericValue.length <= 5) {
        maskedValue = `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
      } else if (numericValue.length <= 8) {
        maskedValue = `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
      } else {
        maskedValue = `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}-${numericValue.slice(8, 9)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
      return;
    }

    // Aplicar máscara para o campo telefone
    if (name === "phone") {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, "");

      // Aplica a máscara (00) 00000-0000
      let maskedValue = "";
      if (numericValue.length <= 2) {
        maskedValue = numericValue.length ? `(${numericValue}` : "";
      } else if (numericValue.length <= 7) {
        maskedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      } else {
        maskedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
      return;
    }

    // Para os outros campos, atualiza normalmente
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

  const handleHowDidYouMeetUsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      howDidYouMeetUs: value,
    }));
  };

  const formatDateForServer = (dateStr: string) => {
    // Converte de DD/MM/YYYY para YYYY-MM-DD (formato ISO)
    if (!dateStr || dateStr.length !== 10) return "";

    try {
      const parts = dateStr.split("/");
      if (parts.length !== 3) return "";

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Validação básica
      if (
        isNaN(day) || day < 1 || day > 31 ||
        isNaN(month) || month < 1 || month > 12 ||
        isNaN(year) || year < 1900 || year > new Date().getFullYear()
      ) {
        return "";
      }

      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    } catch (error) {
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.cpf ||
      !formData.rg || !formData.phone || !formData.birthDate ||
      !formData.boardingLocation || !formData.city || !formData.howDidYouMeetUs) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Validação do formato da data
    if (formData.birthDate.length !== 10 || !formData.birthDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setError("A data de nascimento deve estar no formato DD/MM/AAAA.");
      setIsSubmitting(false);
      return;
    }

    // Conversão da data
    const formattedDate = formatDateForServer(formData.birthDate);
    if (!formattedDate) {
      setError("Data de nascimento inválida.");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido.");
      setIsSubmitting(false);
      return;
    }

    // Format data if needed
    const formattedData = {
      ...formData,
      // Converter para ISO format
      birthDate: new Date(formattedDate).toISOString(),
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/bookings`,
        formattedData
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
            boardingLocation: travelPackage.boardingLocations?.[0] || "",
            city: "",
            howDidYouMeetUs: "",
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
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
                  <Label htmlFor="birthDate">Data de nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    placeholder="DD/MM/AAAA"
                    required
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boardingLocation">Local de embarque</Label>
                  <Select
                    value={formData.boardingLocation || undefined}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Digite sua cidade"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howDidYouMeetUs">Como você nos conheceu?</Label>
                  <Select
                    value={formData.howDidYouMeetUs || undefined}
                    onValueChange={handleHowDidYouMeetUsChange}
                  >
                    <SelectTrigger id="howDidYouMeetUs">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Indicação de amigos">Indicação de amigos</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
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
              <Button className="bg-blue-500 hover:bg-blue-600 text-white mb-4" type="submit" disabled={isSubmitting}>
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
