/**
 * ============================================================
 * MIDDLEWARE DE NEXT.JS CON RBAC
 * ============================================================
 * 
 * Este archivo se ejecuta ANTES de cada request.
 * Lo usamos para proteger rutas que requieren autenticación y permisos.
 * 
 * FUNCIONAMIENTO:
 * 1. Usuario intenta acceder a /dashboard/*
 * 2. Middleware verifica si existe el token
 * 3. Si no hay token → redirige a /login
 * 4. Si hay token → decodifica y verifica permisos
 * 5. Si no tiene permisos → redirige a /dashboard
 * 
 * IMPORTANTE: El middleware NO puede acceder a localStorage.
 * Por eso usamos cookies para el token.
 * 
 * RBAC (Role-Based Access Control):
 * - Los roles en ADMIN_ROLES pueden acceder a todo
 * - Otros roles necesitan permisos específicos por ruta
 * - Los permisos son DINÁMICOS (vienen del backend)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Nombre de la cookie donde guardamos el token
const AUTH_COOKIE = 'auth_token';

/** Permiso especial que indica acceso total */
const FULL_ACCESS_PERMISSION = 'FULL_ACCESS';

// Rutas públicas (no requieren login)
const PUBLIC_ROUTES = [
  '/',           // Página de inicio pública
  '/login',      // Página de login
  '/register',   // Página de registro
  '/reservar',   // Página pública para reservar
  '/nosotros',   // Página nosotros
  '/servicios',  // Página servicios públicos
];

// Rutas que empiezan con estas rutas también son públicas
const PUBLIC_PREFIXES = [
  '/api/public', // APIs públicas
  '/_next',      // Archivos de Next.js
  '/favicon',    // Favicon
];

// ============================================================
// MAPA DE RUTAS → PERMISOS REQUERIDOS
// ============================================================
/**
 * Define qué permisos necesita cada ruta del dashboard.
 * Si una ruta no está aquí, solo requiere estar autenticado.
 * 
 * Los permisos son STRINGS dinámicos que vienen del backend.
 * Puedes agregar nuevas rutas aquí cuando el backend agregue permisos.
 */
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard/clientes': ['READ_CLIENTS'],
  '/dashboard/profesionales': ['READ_PROFESSIONALS'],
  '/dashboard/categorias': ['READ_CATEGORIES'],
  '/dashboard/servicios': ['READ_SERVICES'],
  '/dashboard/reservas': ['READ_BOOKING'],
  '/dashboard/configuracion': ['MANAGE_SETTINGS'],
};

// ============================================================
// FUNCIONES AUXILIARES PARA DECODIFICAR JWT
// ============================================================

interface JwtPayloadMiddleware {
  roles?: string[];
  permissions?: string[];
  isAdmin?: boolean;    // El backend indica si tiene acceso total
  negocioId?: number;
  usuarioId?: number;
  sub?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decodifica un JWT sin verificar firma (en middleware)
 * NOTA: La verificación de firma la hace el backend
 */
function decodeJwtInMiddleware(token: string): JwtPayloadMiddleware | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Verifica si el usuario tiene acceso total.
 * El backend lo indica de varias formas (en orden de prioridad):
 * 1. Campo `isAdmin: true` en el JWT
 * 2. Permiso especial `FULL_ACCESS` en el array de permisos
 * 3. FALLBACK: Rol que contenga "ADMIN" (ej: "ADMIN", "SUPER_ADMIN")
 *    → Esto es temporal mientras el backend no envíe isAdmin
 */
function isAdminRole(payload: JwtPayloadMiddleware | null): boolean {
  if (!payload) return false;
  
  // Opción 1: El backend envía isAdmin: true
  if (payload.isAdmin === true) return true;
  
  // Opción 2: Tiene el permiso especial FULL_ACCESS
  if (payload.permissions?.includes(FULL_ACCESS_PERMISSION)) return true;
  
  // Opción 3 (FALLBACK): El rol contiene "ADMIN"
  if (payload.roles?.some(role => role.toUpperCase().includes('ADMIN'))) return true;
  
  return false;
}

/**
 * Verifica si tiene alguno de los permisos requeridos
 */
function hasRequiredPermission(
  payload: JwtPayloadMiddleware | null, 
  requiredPermissions: string[]
): boolean {
  // Admin siempre tiene acceso
  if (isAdminRole(payload)) return true;
  
  // Si no hay permisos en el payload, no tiene acceso
  if (!payload?.permissions || payload.permissions.length === 0) return false;
  
  // Verificar si tiene al menos uno de los permisos requeridos
  return requiredPermissions.some(p => payload.permissions?.includes(p));
}

/**
 * Obtiene los permisos requeridos para una ruta específica
 */
function getRequiredPermissions(pathname: string): string[] | null {
  // Buscar coincidencia exacta primero
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }
  
  // Buscar coincidencia por prefijo (para rutas anidadas)
  for (const [route, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return permissions;
    }
  }
  
  return null;
}

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
  // 3. VERIFICAR PERMISOS RBAC (Solo para rutas /dashboard)
  // ============================================================
  
  if (token && pathname.startsWith('/dashboard')) {
    // Decodificar JWT para obtener roles y permisos
    const payload = decodeJwtInMiddleware(token);
    
    // Verificar si el token expiró
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      // Token expirado → redirigir a login
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Eliminar cookie expirada
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }
    
    // Obtener permisos requeridos para esta ruta
    const requiredPermissions = getRequiredPermissions(pathname);
    
    // Si la ruta requiere permisos específicos
    if (requiredPermissions && requiredPermissions.length > 0) {
      // Verificar si tiene los permisos necesarios
      if (!hasRequiredPermission(payload, requiredPermissions)) {
        // Sin permisos → redirigir al dashboard principal
        console.log(`[Middleware] Acceso denegado a ${pathname}. Permisos requeridos: ${requiredPermissions.join(', ')}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  // ============================================================
  // 4. SI ESTÁ LOGUEADO Y VA A /login, REDIRIGIR A DASHBOARD
  // ============================================================
  
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // ============================================================
  // 5. PERMITIR ACCESO
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
