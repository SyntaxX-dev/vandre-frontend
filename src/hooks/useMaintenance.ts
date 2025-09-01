import { useState, useEffect } from 'react';
import { getMaintenanceConfig, isMaintenanceMode } from '@/config/maintenance';

export const useMaintenance = () => {
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [config, setConfig] = useState(getMaintenanceConfig());

  useEffect(() => {
    // Verificar o status de manutenção ao carregar
    setMaintenanceActive(isMaintenanceMode());
    setConfig(getMaintenanceConfig());
  }, []);

  const toggleMaintenance = (active: boolean) => {
    // Em um ambiente real, isso seria uma chamada para API
    // Por enquanto, apenas atualizamos o estado local
    setMaintenanceActive(active);
    
    // Você pode implementar uma API para persistir essa configuração
    console.log(`Modo de manutenção ${active ? 'ativado' : 'desativado'}`);
  };

  const updateMaintenanceConfig = (newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    
    // Você pode implementar uma API para persistir essas configurações
    console.log('Configuração de manutenção atualizada:', newConfig);
  };

  return {
    maintenanceActive,
    config,
    toggleMaintenance,
    updateMaintenanceConfig,
    isMaintenanceMode: () => maintenanceActive
  };
}; 
