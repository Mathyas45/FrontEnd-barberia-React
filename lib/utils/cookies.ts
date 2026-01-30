/**
 * ============================================================
 * UTILIDADES PARA COOKIES - TOKEN DE AUTENTICACIÓN
 * ============================================================
 * 
 * El token JWT se guarda SOLO en cookie (única fuente de verdad).
 * 
 * ¿POR QUÉ COOKIE Y NO LOCALSTORAGE?
 * - Cookie: Accesible en cliente (JavaScript) Y servidor (middleware)
 * - localStorage: Solo accesible en el cliente
 * 
 * ¿QUIÉN LEE ESTA COOKIE?
 * - middleware.ts: Verifica si el usuario puede acceder a /dashboard/*
 * - http-client.ts: Lee el token para enviarlo en el header Authorization
 * - auth.service.ts: Verifica si hay sesión activa
 * 
 * VENTAJAS:
 * - Una única fuente de verdad para el token
 * - No hay duplicación de datos
 * - Más fácil de mantener y debuggear
 */

// Nombre de la cookie de autenticación
export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Guarda el token en una cookie
 * @param token - JWT token del backend
 */
export function setAuthCookie(token: string): void {
  // Configurar cookie que dura 7 días
  const maxAge = 60 * 60 * 24 * 7; // 7 días en segundos
  
  // SameSite=Lax: Protección contra CSRF
  // Secure: Solo en HTTPS (en producción)
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Obtiene el token de la cookie
 * @returns Token o null si no existe
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

/**
 * Elimina la cookie de autenticación
 * Usado al cerrar sesión
 */
export function removeAuthCookie(): void {
  // Poner max-age=0 elimina la cookie
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Verifica si hay una cookie de autenticación
 * @returns true si el usuario tiene token
 */
export function isAuthenticated(): boolean {
  return getAuthCookie() !== null;
}
