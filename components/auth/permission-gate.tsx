'use client';

/**
 * ============================================================
 * COMPONENTES DE PROTECCIÓN DE PERMISOS (RBAC)
 * ============================================================
 * 
 * Componentes para controlar acceso basado en roles y permisos.
 * 
 * COMPONENTES:
 * 
 * 1. PermissionGate - Renderiza contenido solo si tiene permisos
 *    <PermissionGate permissions={['CREATE_CLIENTS']}>
 *      <button>Crear Cliente</button>
 *    </PermissionGate>
 * 
 * 2. ProtectedRoute - Protege una página/ruta completa
 *    <ProtectedRoute permissions={['READ_CLIENTS']}>
 *      <ClientesPage />
 *    </ProtectedRoute>
 * 
 * 3. AdminOnly - Solo visible para ADMIN/SUPER_ADMIN
 *    <AdminOnly>
 *      <ConfiguracionAvanzada />
 *    </AdminOnly>
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePermissions } from '@/lib/hooks/use-permissions';
import type { Permission, RolNombre } from '@/lib/types';

// ============================================================
// PERMISSION GATE
// ============================================================

interface PermissionGateProps {
  /** Permisos requeridos para ver el contenido */
  permissions: Permission[];
  /** Si true, necesita TODOS los permisos. Si false, cualquiera (default: false) */
  requireAll?: boolean;
  /** Contenido a mostrar si tiene permisos */
  children: React.ReactNode;
  /** Contenido alternativo si NO tiene permisos (opcional) */
  fallback?: React.ReactNode;
}

/**
 * Renderiza el contenido solo si el usuario tiene los permisos requeridos.
 * ADMIN/SUPER_ADMIN siempre pueden ver el contenido.
 * 
 * @example
 * // Mostrar botón solo si puede crear clientes
 * <PermissionGate permissions={['CREATE_CLIENTS']}>
 *   <button onClick={handleCreate}>Nuevo Cliente</button>
 * </PermissionGate>
 * 
 * @example
 * // Mostrar si tiene CUALQUIERA de los permisos
 * <PermissionGate permissions={['CREATE_CLIENTS', 'UPDATE_CLIENTS']}>
 *   <FormularioCliente />
 * </PermissionGate>
 * 
 * @example
 * // Mostrar solo si tiene TODOS los permisos
 * <PermissionGate permissions={['READ_CLIENTS', 'DELETE_CLIENTS']} requireAll>
 *   <EliminarClienteButton />
 * </PermissionGate>
 */
export function PermissionGate({
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { isAdmin, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Admin siempre puede ver
  if (isAdmin) {
    return <>{children}</>;
  }

  // Verificar permisos según el modo
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions) 
    : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// ============================================================
// ROLE GATE
// ============================================================

interface RoleGateProps {
  /** Roles permitidos */
  roles: RolNombre[];
  /** Contenido a mostrar si tiene el rol */
  children: React.ReactNode;
  /** Contenido alternativo si NO tiene el rol (opcional) */
  fallback?: React.ReactNode;
}

/**
 * Renderiza el contenido solo si el usuario tiene uno de los roles especificados.
 * 
 * @example
 * <RoleGate roles={['ADMIN', 'SUPER_ADMIN']}>
 *   <ConfiguracionAvanzada />
 * </RoleGate>
 */
export function RoleGate({
  roles,
  children,
  fallback = null,
}: RoleGateProps) {
  const { hasRole } = usePermissions();

  const hasRequiredRole = roles.some(role => hasRole(role));

  return hasRequiredRole ? <>{children}</> : <>{fallback}</>;
}

// ============================================================
// ADMIN ONLY
// ============================================================

interface AdminOnlyProps {
  /** Contenido a mostrar solo para admins */
  children: React.ReactNode;
  /** Contenido alternativo para no-admins (opcional) */
  fallback?: React.ReactNode;
}

/**
 * Shortcut para mostrar contenido solo a ADMIN/SUPER_ADMIN
 * 
 * @example
 * <AdminOnly>
 *   <button onClick={handleDeleteAll}>Eliminar Todo</button>
 * </AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = usePermissions();
  return isAdmin ? <>{children}</> : <>{fallback}</>;
}

// ============================================================
// PROTECTED ROUTE
// ============================================================

interface ProtectedRouteProps {
  /** Permisos requeridos para acceder a la ruta */
  permissions?: Permission[];
  /** Si true, necesita TODOS los permisos */
  requireAll?: boolean;
  /** Contenido de la página */
  children: React.ReactNode;
  /** URL a redirigir si no tiene permisos (default: /dashboard) */
  redirectTo?: string;
  /** Componente a mostrar mientras carga (opcional) */
  loadingComponent?: React.ReactNode;
}

/**
 * Protege una ruta/página completa.
 * Redirige si el usuario no tiene los permisos necesarios.
 * 
 * @example
 * // En app/dashboard/clientes/page.tsx
 * export default function ClientesPage() {
 *   return (
 *     <ProtectedRoute permissions={['READ_CLIENTS']}>
 *       <ClientesContent />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({
  permissions = [],
  requireAll = false,
  children,
  redirectTo = '/dashboard',
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { 
    isAdmin, 
    isAuthenticated, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissions();

  // Verificar acceso
  const hasAccess = (() => {
    // No autenticado → sin acceso
    if (!isAuthenticated) return false;
    
    // Admin siempre tiene acceso
    if (isAdmin) return true;
    
    // Si no hay permisos requeridos, tiene acceso
    if (permissions.length === 0) return true;
    
    // Verificar permisos según modo
    return requireAll 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  })();

  // Redirigir si no tiene acceso
  useEffect(() => {
    if (!hasAccess && isAuthenticated) {
      // Usuario autenticado pero sin permisos → redirigir
      router.replace(redirectTo);
    }
  }, [hasAccess, isAuthenticated, router, redirectTo]);

  // Mientras verifica, mostrar loading
  if (!isAuthenticated) {
    return loadingComponent || <DefaultLoading />;
  }

  // Sin acceso → no mostrar nada (se está redirigiendo)
  if (!hasAccess) {
    return loadingComponent || <AccessDenied />;
  }

  return <>{children}</>;
}

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

function DefaultLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <svg 
          className="w-8 h-8 text-red-600 dark:text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Acceso Denegado
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        No tienes permisos para acceder a esta sección. 
        Contacta al administrador si crees que esto es un error.
      </p>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export default PermissionGate;
