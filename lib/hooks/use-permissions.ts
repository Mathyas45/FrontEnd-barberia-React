'use client';

/**
 * ============================================================
 * HOOK - usePermissions (RBAC)
 * ============================================================
 * 
 * Hook para verificar permisos del usuario actual.
 * Usa el token JWT almacenado en cookies.
 * 
 * CARACTERÍSTICAS:
 * - Los roles en ADMIN_ROLES tienen acceso total (ignora permisos)
 * - Otros roles dependen de sus permisos asignados
 * - Funciones memoizadas para evitar re-renders
 * - Permisos y roles son DINÁMICOS (strings del backend)
 * 
 * USO:
 * const { hasPermission, isAdmin, canAccess } = usePermissions();
 * 
 * // Verificar un permiso (string dinámico)
 * if (hasPermission('CREATE_CLIENTS')) { ... }
 * 
 * // Verificar múltiples permisos
 * if (canAccess(['READ_CLIENTS', 'UPDATE_CLIENTS'])) { ... }
 */

import { useMemo, useCallback } from 'react';
import { 
  decodeJwt, 
  isTokenExpired, 
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  hasRole as checkRole,
  isAdmin as checkIsAdmin,
} from '@/lib/utils/jwt.utils';
import { FULL_ACCESS_PERMISSION } from '@/lib/types';
import type { Permission, RolNombre, JwtPayload } from '@/lib/types';

// ============================================================
// TIPOS
// ============================================================

interface UsePermissionsReturn {
  /** Payload del JWT decodificado */
  payload: JwtPayload | null;
  
  /** Roles del usuario (strings dinámicos) */
  roles: RolNombre[];
  
  /** Permisos del usuario (strings dinámicos) */
  permissions: Permission[];
  
  /** true si el usuario tiene un rol de admin */
  isAdmin: boolean;
  
  /** true si el token es válido y no ha expirado */
  isAuthenticated: boolean;
  
  /** Verifica si tiene un rol específico */
  hasRole: (role: RolNombre) => boolean;
  
  /** Verifica si tiene un permiso específico (Admin siempre true) */
  hasPermission: (permission: Permission) => boolean;
  
  /** Verifica si tiene AL MENOS UNO de los permisos */
  hasAnyPermission: (permissions: Permission[]) => boolean;
  
  /** Verifica si tiene TODOS los permisos */
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  /** Alias de hasAnyPermission - más legible */
  canAccess: (permissions: Permission[]) => boolean;
  
  /** Verifica acceso para mostrar un elemento de menú */
  canViewMenuItem: (requiredPermissions?: Permission[]) => boolean;
}

// ============================================================
// FUNCIÓN HELPER: Obtener token de cookie (client-side)
// ============================================================

function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

// ============================================================
// HOOK
// ============================================================

export function usePermissions(): UsePermissionsReturn {
  // Obtener y decodificar el token
  const token = getTokenFromCookie();
  
  // Memoizar el payload para evitar decodificar en cada render
  const payload = useMemo(() => {
    if (!token) return null;
    return decodeJwt(token);
  }, [token]);

  // Memoizar roles y permisos
  const roles = useMemo(() => payload?.roles || [], [payload]);
  const permissions = useMemo(() => payload?.permissions || [], [payload]);

  // Verificar si es admin
  const isAdmin = useMemo(() => {
    if (!token) return false;
    return checkIsAdmin(token);
  }, [token]);

  // Verificar autenticación
  const isAuthenticated = useMemo(() => {
    if (!token || !payload) return false;
    return !isTokenExpired(payload);
  }, [token, payload]);

  // Funciones de verificación (memoizadas con useCallback)
  const hasRole = useCallback((role: RolNombre) => {
    if (!token) return false;
    return checkRole(token, role);
  }, [token]);

  const hasPermission = useCallback((permission: Permission) => {
    if (!token) return false;
    return checkPermission(token, permission);
  }, [token]);

  const hasAnyPermission = useCallback((perms: Permission[]) => {
    if (!token) return false;
    return checkAnyPermission(token, perms);
  }, [token]);

  const hasAllPermissions = useCallback((perms: Permission[]) => {
    if (!token) return false;
    return checkAllPermissions(token, perms);
  }, [token]);

  // Alias para mejor legibilidad
  const canAccess = hasAnyPermission;

  // Para items de menú: si no hay permisos requeridos, todos pueden ver
  const canViewMenuItem = useCallback((requiredPermissions?: Permission[]) => {
    // Si no hay permisos requeridos, todos pueden ver
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    // Admin puede ver todo
    if (isAdmin) return true;
    // Verificar si tiene alguno de los permisos
    return hasAnyPermission(requiredPermissions);
  }, [isAdmin, hasAnyPermission]);

  return {
    payload,
    roles,
    permissions,
    isAdmin,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    canViewMenuItem,
  };
}

export default usePermissions;
