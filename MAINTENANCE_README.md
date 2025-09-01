# Sistema de Manutenção - Vandre Turismo

Este sistema permite ativar/desativar facilmente o modo de manutenção do site.

## Como Usar

### 1. Ativar/Desativar Modo de Manutenção

Para ativar o modo de manutenção, edite o arquivo `src/config/maintenance.ts`:

```typescript
export const MAINTENANCE_CONFIG = {
  // Mude para true para ativar o modo de manutenção
  isMaintenanceMode: true,
  
  // Outras configurações...
};
```

### 2. Configurações Disponíveis

```typescript
export const MAINTENANCE_CONFIG = {
  // Controla se o site está em manutenção
  isMaintenanceMode: false,
  
  // Mensagem exibida na página de manutenção
  maintenanceMessage: "Estamos trabalhando para melhorar sua experiência",
  
  // Tempo estimado de manutenção em dias
  estimatedDays: 5,
  
  // Informações de contato
  contactInfo: {
    email: "brenohslima@gmail.com",
    phone: "83987690902",
    whatsapp: "83987690902"
  },
  
  // Data/hora estimada de conclusão (opcional)
  estimatedCompletion: null,
  
  // Redirecionar todas as rotas para manutenção
  redirectAllRoutes: true,
  
  // Rotas permitidas durante manutenção
  allowedRoutes: [
    "/maintenance",
    "/api/health"
  ]
};
```

### 3. Funcionalidades

- **Redirecionamento Automático**: Quando ativado, todas as rotas são redirecionadas para `/maintenance`
- **Contador Regressivo**: Exibe tempo estimado de conclusão
- **Informações de Contato**: Links diretos para email e telefone
- **Design Responsivo**: Funciona em desktop e mobile
- **Rotas Permitidas**: Algumas rotas podem ser permitidas mesmo em manutenção

### 4. Página de Manutenção

A página de manutenção (`/maintenance`) inclui:

- Design moderno com gradientes
- Ícones do Lucide React
- Contador regressivo
- Informações de contato
- Logo da empresa
- Mensagem personalizada

### 5. Middleware

O middleware (`src/middleware.ts`) intercepta todas as requisições e:

- Verifica se o modo de manutenção está ativo
- Redireciona para `/maintenance` se necessário
- Permite rotas específicas mesmo em manutenção

### 6. Hook Personalizado

Use o hook `useMaintenance` para gerenciar o estado:

```typescript
import { useMaintenance } from '@/hooks/useMaintenance';

const { maintenanceActive, toggleMaintenance, config } = useMaintenance();
```

### 7. Exemplo de Uso

```typescript
// Para ativar manutenção
toggleMaintenance(true);

// Para desativar manutenção
toggleMaintenance(false);

// Para atualizar configurações
updateMaintenanceConfig({
  maintenanceMessage: "Nova mensagem",
  estimatedDays: 3
});
```

## Arquivos Criados/Modificados

- `src/app/maintenance.tsx` - Componente da página de manutenção
- `src/app/maintenance/page.tsx` - Rota da página de manutenção
- `src/config/maintenance.ts` - Configurações de manutenção
- `src/middleware.ts` - Middleware para redirecionamento
- `src/hooks/useMaintenance.ts` - Hook para gerenciar manutenção

## Próximos Passos

Para uma implementação completa, considere:

1. **API para Configuração**: Criar endpoints para gerenciar configurações via API
2. **Persistência**: Salvar configurações em banco de dados
3. **Painel Admin**: Interface para gerenciar manutenção
4. **Notificações**: Alertar usuários sobre manutenção programada
5. **Logs**: Registrar quando manutenção foi ativada/desativada

## Notas Importantes

- O middleware funciona apenas em produção
- Para desenvolvimento, você pode acessar `/maintenance` diretamente
- As configurações são carregadas em tempo de compilação
- Para mudanças dinâmicas, implemente uma API
