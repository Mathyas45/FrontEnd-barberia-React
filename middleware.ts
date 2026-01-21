/**
 * ============================================================
 * MIDDLEWARE DE NEXT.JS
 * ============================================================
 * 
 * Este archivo se ejecuta ANTES de cada request.
 * Lo usamos para proteger rutas que requieren autenticación.
 * 
 * FUNCIONAMIENTO:
 * 1. Usuario intenta acceder a /dashboard/*
 * 2. Middleware verifica si existe el token
 * 3. Si no hay token → redirige a /login
 * 4. Si hay token → permite el acceso
 * 
 * IMPORTANTE: El middleware NO puede acceder a localStorage.
 * Por eso usamos cookies para el token.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Nombre de la cookie donde guardamos el token
const AUTH_COOKIE = 'auth_token';

// Rutas públicas (no requieren login)
const PUBLIC_ROUTES = [
  '/',           // Página de inicio pública
  '/login',      // Página de login
  '/register',   // Página de registro
  '/reservar',   // Página pública para reservar
];

// Rutas que empiezan con estas rutas también son públicas
const PUBLIC_PREFIXES = [
  '/api/public', // APIs públicas
  '/_next',      // Archivos de Next.js
  '/favicon',    // Favicon
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ============================================================
  // 1. VERIFICAR SI ES RUTA PÚBLICA
  // ============================================================
  
  // Verificar rutas exactas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Verificar prefijos públicos
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }
  
  // ============================================================
  // 2. PARA RUTAS PROTEGIDAS, VERIFICAR TOKEN
  // ============================================================
  
  // Obtener token de las cookies
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  
  // Si no hay token y quiere acceder a /dashboard
  if (!token && pathname.startsWith('/dashboard')) {
    // Guardar la URL a la que quería ir (para redirigir después del login)
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // ============================================================
  // 3. SI ESTÁ LOGUEADO Y VA A /login, REDIRIGIR A DASHBOARD
  // ============================================================
  
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // ============================================================
  // 4. PERMITIR ACCESO
  // ============================================================
  
  return NextResponse.next();
}

/**
 * Configuración: En qué rutas se ejecuta el middleware
 * matcher define los patrones de URL donde se activa
 */
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas EXCEPTO:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - Archivos estáticos (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
