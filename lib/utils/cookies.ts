/**
 * ============================================================
 * UTILIDADES PARA COOKIES
 * ============================================================
 * 
 * Funciones helper para manejar cookies del lado del cliente.
 * Las usamos junto con el middleware para autenticación.
 * 
 * ¿POR QUÉ COOKIES Y NO SOLO LOCALSTORAGE?
 * - localStorage: Solo accesible en el cliente (JavaScript)
 * - cookies: Accesibles en cliente Y servidor (middleware)
 * 
 * El middleware de Next.js se ejecuta en el servidor,
 * por eso necesitamos cookies para verificar autenticación.
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
