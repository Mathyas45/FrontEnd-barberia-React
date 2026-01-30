/**
 * ============================================================
 * UTILIDADES JWT - Decodificación y Extracción de Permisos
 * ============================================================
 * 
 * Funciones para trabajar con tokens JWT:
 * - Decodificar el payload sin verificar firma (la verificación la hace el backend)
 * - Extraer roles y permisos
 * - Verificar expiración
 * 
 * IMPORTANTE: 
 * - La validación de firma SIEMPRE la hace el backend.
 * - Los permisos y roles son DINÁMICOS (vienen del backend)
 * - El acceso total se determina por:
 *   1. Campo `isAdmin: true` en el JWT
 *   2. Permiso especial `FULL_ACCESS`
 */

import type { JwtPayload, Permission, RolNombre } from '@/lib/types';
import { FULL_ACCESS_PERMISSION } from '@/lib/types';

/**
 * Decodifica un token JWT y extrae el payload
 * NO verifica la firma (eso lo hace el backend)
 * 
 * @param token - Token JWT completo
 * @returns Payload decodificado o null si es inválido
 * 
 * @example
 * const payload = decodeJwt(token);
 * console.log(payload.roles); // ["ADMIN"]
 * console.log(payload.permissions); // ["CREATE_CLIENTS", "READ_CLIENTS"]
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // El JWT tiene 3 partes: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('JWT inválido: debe tener 3 partes');
      return null;
    }

    // Decodificar el payload (parte 2, índice 1)
    const payload = parts[1];
    
    // Base64Url -> Base64 -> JSON
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica si el token ha expirado
 * 
 * @param token - Token JWT o payload ya decodificado
 * @returns true si el token ha expirado
 */
export function isTokenExpired(token: string | JwtPayload): boolean {
  const payload = typeof token === 'string' ? decodeJwt(token) : token;
  
  if (!payload || !payload.exp) {
    return true; // Sin payload o sin exp, consideramos expirado
  }

  // exp está en segundos, Date.now() en milisegundos
  const expirationTime = payload.exp * 1000;
  const now = Date.now();
  
  // Agregar un margen de 60 segundos para evitar problemas de sincronización
  return now >= expirationTime - 60000;
}

/**
 * Extrae los roles del token
 * 
 * @param token - Token JWT
 * @returns Array de roles o array vacío
 */
export function getRolesFromToken(token: string): RolNombre[] {
  const payload = decodeJwt(token);
  return payload?.roles || [];
}

/**
 * Extrae los permisos del token
 * 
 * @param token - Token JWT
 * @returns Array de permisos o array vacío
 */
export function getPermissionsFromToken(token: string): Permission[] {
  const payload = decodeJwt(token);
  return payload?.permissions || [];
}

/**
 * Verifica si el usuario tiene un rol específico
 * 
 * @param token - Token JWT
 * @param role - Rol a verificar
 * @returns true si tiene el rol
 */
export function hasRole(token: string, role: RolNombre): boolean {
  const roles = getRolesFromToken(token);
  return roles.includes(role);
}

/**
 * Verifica si el usuario tiene acceso total.
 * El backend lo indica de varias formas (en orden de prioridad):
 * 1. Campo `isAdmin: true` en el JWT
 * 2. Permiso especial `FULL_ACCESS` en el array de permisos
 * 3. FALLBACK: Rol que contenga "ADMIN" (ej: "ADMIN", "SUPER_ADMIN")
 *    → Esto es temporal mientras el backend no envíe isAdmin
 * 
 * @param token - Token JWT
 * @returns true si tiene acceso total
 */
export function isAdmin(token: string): boolean {
  const payload = decodeJwt(token);
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
 * Verifica si el usuario tiene un permiso específico
 * ADMIN siempre tiene todos los permisos
 * 
 * @param token - Token JWT
 * @param permission - Permiso a verificar
 * @returns true si tiene el permiso
 */
export function hasPermission(token: string, permission: Permission): boolean {
  // Admin tiene todos los permisos
  if (isAdmin(token)) {
    return true;
  }
  
  const permissions = getPermissionsFromToken(token);
  return permissions.includes(permission);
}

/**
 * Verifica si el usuario tiene TODOS los permisos especificados
 * ADMIN siempre tiene todos los permisos
 * 
 * @param token - Token JWT
 * @param permissions - Array de permisos a verificar
 * @returns true si tiene TODOS los permisos
 */
export function hasAllPermissions(token: string, permissions: Permission[]): boolean {
  if (isAdmin(token)) {
    return true;
  }
  
  return permissions.every(p => hasPermission(token, p));
}

/**
 * Verifica si el usuario tiene AL MENOS UNO de los permisos especificados
 * ADMIN siempre tiene todos los permisos
 * 
 * @param token - Token JWT
 * @param permissions - Array de permisos a verificar
 * @returns true si tiene al menos uno
 */
export function hasAnyPermission(token: string, permissions: Permission[]): boolean {
  if (isAdmin(token)) {
    return true;
  }
  
  return permissions.some(p => hasPermission(token, p));
}

/**
 * Obtiene información resumida del token para debugging
 * 
 * @param token - Token JWT
 * @returns Objeto con info del token
 */
export function getTokenInfo(token: string): {
  isValid: boolean;
  isExpired: boolean;
  roles: RolNombre[];
  permissions: Permission[];
  email: string | null;
  expiresAt: Date | null;
} {
  const payload = decodeJwt(token);
  
  if (!payload) {
    return {
      isValid: false,
      isExpired: true,
      roles: [],
      permissions: [],
      email: null,
      expiresAt: null,
    };
  }

  return {
    isValid: true,
    isExpired: isTokenExpired(payload),
    roles: payload.roles || [],
    permissions: payload.permissions || [],
    email: payload.sub || null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
  };
}

// ============================================================
// MULTITENANCY - Obtener negocioId del token
// ============================================================

/**
 * Obtiene el negocioId del token almacenado en cookie.
 * Útil para sistemas multitenancy donde cada request debe
 * filtrar por el negocio del usuario autenticado.
 * 
 * @returns negocioId o null si no hay token
 * 
 * @example
 * const negocioId = getNegocioIdFromToken();
 * // Usar en servicios: GET /clientes?negocioId=${negocioId}
 */
export function getNegocioIdFromToken(): number | null {
  if (typeof window === 'undefined') return null;
  
  // Leer token de cookie
  const cookies = document.cookie.split(';');
  let token: string | null = null;
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      token = value;
      break;
    }
  }
  
  if (!token) return null;
  
  const payload = decodeJwt(token);
  return payload?.negocioId ?? null;
}

/**
 * Obtiene el usuarioId del token almacenado en cookie.
 * 
 * @returns usuarioId o null si no hay token
 */
export function getUsuarioIdFromToken(): number | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  let token: string | null = null;
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      token = value;
      break;
    }
  }
  
  if (!token) return null;
  
  const payload = decodeJwt(token);
  return payload?.usuarioId ?? null;
}
