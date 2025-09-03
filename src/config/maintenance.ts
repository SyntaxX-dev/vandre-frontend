// Configuração de manutenção do site
export const MAINTENANCE_CONFIG = {
  // Defina como true para ativar o modo de manutenção
  isMaintenanceMode: false,
  
  // Mensagem personalizada para a página de manutenção
  maintenanceMessage: "Estamos trabalhando para melhorar sua experiência",
  
  // Tempo estimado de manutenção em dias
  estimatedDays: 5,
  
  // Informações de contato durante a manutenção
  contactInfo: {
    email: "brenohslima@gmail.com",
    phone: "83987690902",
    whatsapp: "83987690902"
  },
  
  // Data e hora estimada de conclusão (opcional)
  estimatedCompletion: null, // Formato: "2024-01-15T18:00:00"
  
  // Redirecionar para página de manutenção em todas as rotas
  redirectAllRoutes: true,
  
  // Rotas que devem ser permitidas mesmo em manutenção
  allowedRoutes: [
    "/maintenance",
    "/api/health"
  ]
};

// Função para verificar se o site está em manutenção
export const isMaintenanceMode = (): boolean => {
  return MAINTENANCE_CONFIG.isMaintenanceMode;
};

// Função para obter a configuração de manutenção
export const getMaintenanceConfig = () => {
  return MAINTENANCE_CONFIG;
}; 
