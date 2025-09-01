import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MAINTENANCE_CONFIG } from './config/maintenance';

export function middleware(request: NextRequest) {
  // Verificar se o modo de manutenção está ativo
  if (MAINTENANCE_CONFIG.isMaintenanceMode && MAINTENANCE_CONFIG.redirectAllRoutes) {
    const { pathname } = request.nextUrl;
    
    // Verificar se a rota atual está na lista de rotas permitidas
    const isAllowedRoute = MAINTENANCE_CONFIG.allowedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // Se não for uma rota permitida, redirecionar para a página de manutenção
    if (!isAllowedRoute && pathname !== '/maintenance') {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 
