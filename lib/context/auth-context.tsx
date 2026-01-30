'use client';

/**
 * ============================================================
 * CONTEXTO DE AUTENTICACIÓN Y AUTORIZACIÓN (RBAC)
 * ============================================================
 * 
 * Provee el estado de autenticación y permisos a toda la aplicación.
 * 
 * ¿QUÉ ES UN CONTEXT?
 * - Es una forma de pasar datos a través del árbol de componentes
 * - Sin necesidad de pasar props manualmente en cada nivel
 * - Perfecto para datos "globales" como: usuario, tema, idioma
 * 
 * SISTEMA DE PERMISOS (RBAC):
 * - El JWT contiene roles[] y permissions[]
 * - ADMIN/SUPER_ADMIN tienen acceso total (bypass de permisos)
 * - Otros roles usan la lista de permissions para verificar acceso
 * 
 * CÓMO SE USA:
 * 1. Envolver la app con <AuthProvider>
 * 2. Usar el hook useAuth() en cualquier componente
 * 
 * EJEMPLO:
 * const { user, isAdmin, hasPermission } = useAuth();
 * 
 * if (hasPermission('DELETE_CLIENTS')) {
 *   // Mostrar botón de eliminar
 * }
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  useMemo,
  type ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { decodeJwt } from '@/lib/utils/jwt.utils';
import { FULL_ACCESS_PERMISSION } from '@/lib/types';
import type { Usuario, LoginRequest, Permission, RolNombre, JwtPayload } from '@/lib/types';

// ============================================================
// FUNCIÓN AUXILIAR: Verificar si es Admin desde payload
// ============================================================
/**
 * Verifica si el usuario tiene acceso total.
 * El backend lo indica de varias formas (en orden de prioridad):
 * 1. Campo `isAdmin: true` en el JWT
 * 2. Permiso especial `FULL_ACCESS` en el array de permisos
 * 3. FALLBACK: Rol que contenga "ADMIN" (ej: "ADMIN", "SUPER_ADMIN")
 *    → Esto es temporal mientras el backend no envíe isAdmin
 */
function isAdminPayload(payload: JwtPayload | null): boolean {
  if (!payload) return false;
  
  // Opción 1: El backend envía isAdmin: true
  if (payload.isAdmin === true) return true;
  
  // Opción 2: Tiene el permiso especial FULL_ACCESS
  if (payload.permissions?.includes(FULL_ACCESS_PERMISSION)) return true;
  
  // Opción 3 (FALLBACK): El rol contiene "ADMIN"
  // Esto permite compatibilidad mientras el backend se actualiza
  if (payload.roles?.some(role => role.toUpperCase().includes('ADMIN'))) return true;
  
  return false;
}

// ============================================================
// TIPOS DEL CONTEXTO
// ============================================================

interface AuthContextType {
  /** Usuario autenticado o null si no hay sesión */
  user: Usuario | null;
  
  /** true mientras se verifica la sesión inicial */
  isLoading: boolean;
  
  /** true si hay un usuario autenticado */
  isAuthenticated: boolean;
  
  /** Roles del usuario desde el JWT */
  roles: RolNombre[];
  
  /** Permisos del usuario desde el JWT */
  permissions: Permission[];
  
  /** true si el usuario es ADMIN o SUPER_ADMIN */
  isAdmin: boolean;
  
  /** ID del negocio al que pertenece el usuario */
  negocioId: number | null;
  
  /** Verifica si tiene un permiso específico (ADMIN siempre true) */
  hasPermission: (permission: Permission) => boolean;
  
  /** Verifica si tiene un rol específico */
  hasRole: (role: RolNombre) => boolean;
  
  /** Verifica si tiene CUALQUIERA de los permisos (ADMIN siempre true) */
  hasAnyPermission: (permissions: Permission[]) => boolean;
  
  /** Verifica si tiene TODOS los permisos (ADMIN siempre true) */
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  /** Función para iniciar sesión */
  login: (credentials: LoginRequest) => Promise<void>;
  
  /** Función para cerrar sesión */
  logout: () => void;
  
  /** Función para refrescar datos del usuario */
  refreshUser: () => Promise<void>;
}

// Valor por defecto (nunca debería usarse si el provider está bien configurado)
const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  roles: [],
  permissions: [],
  isAdmin: false,
  negocioId: null,
  hasPermission: () => false,
  hasRole: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

// Crear el contexto
const AuthContext = createContext<AuthContextType>(defaultContext);

// ============================================================
// PROVIDER - Componente que provee el contexto
// ============================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  
  // Estado del usuario
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(null);

  // ============================================================
  // VALORES DERIVADOS DEL JWT (Memoizados)
  // ============================================================
  const roles = useMemo(() => jwtPayload?.roles ?? [], [jwtPayload]);
  const permissions = useMemo(() => jwtPayload?.permissions ?? [], [jwtPayload]);
  const isAdmin = useMemo(() => isAdminPayload(jwtPayload), [jwtPayload]);
  const negocioId = useMemo(() => jwtPayload?.negocioId ?? null, [jwtPayload]);

  // ============================================================
  // FUNCIONES DE VERIFICACIÓN DE PERMISOS
  // ============================================================
  
  /** Verifica si tiene un permiso específico */
  const hasPermission = useCallback((permission: Permission): boolean => {
    // Admin siempre tiene todos los permisos
    if (isAdminPayload(jwtPayload)) return true;
    return permissions.includes(permission);
  }, [jwtPayload, permissions]);

  /** Verifica si tiene un rol específico */
  const hasRole = useCallback((role: RolNombre): boolean => {
    return roles.includes(role);
  }, [roles]);

  /** Verifica si tiene CUALQUIERA de los permisos */
  const hasAnyPermission = useCallback((perms: Permission[]): boolean => {
    if (isAdminPayload(jwtPayload)) return true;
    return perms.some(p => permissions.includes(p));
  }, [jwtPayload, permissions]);

  /** Verifica si tiene TODOS los permisos */
  const hasAllPermissions = useCallback((perms: Permission[]): boolean => {
    if (isAdminPayload(jwtPayload)) return true;
    return perms.every(p => permissions.includes(p));
  }, [jwtPayload, permissions]);

  // ============================================================
  // EFECTO: Verificar sesión al cargar
  // ============================================================
  useEffect(() => {
    const initAuth = () => {
      try {
        // Obtener token de la cookie (única fuente de verdad)
        const token = authService.getToken();

        if (token) {
          // Decodificar JWT para obtener roles y permisos
          const payload = decodeJwt(token);
          
          if (payload) {
            setJwtPayload(payload);
            
            // Intentar recuperar usuario de localStorage (datos extra)
            const savedUser = authService.getUser();
            
            if (savedUser) {
              setUser(savedUser);
            } else {
              // Si no hay usuario en localStorage, crear uno básico desde el JWT
              const basicUser = {
                id: payload.usuarioId || 0,
                email: payload.sub || '',
                nombreCompleto: payload.sub?.split('@')[0] || 'Usuario',
                activo: true,
                negocio: { id: payload.negocioId || 0, nombre: 'Negocio' },
                rol: { id: 0, nombre: payload.roles?.[0] || 'USER' },
              } as Usuario;
              setUser(basicUser);
            }
          }
        }
      } catch (error) {
        console.error('Error al inicializar auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================================
  // FUNCIÓN: Login
  // ============================================================
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.usuario);
      
      // Decodificar el JWT para obtener roles y permisos
      const payload = decodeJwt(response.token);
      setJwtPayload(payload);
      
      // Redirigir al dashboard después del login exitoso
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ============================================================
  // FUNCIÓN: Logout
  // ============================================================
  const logout = useCallback(() => {
    setUser(null);
    setJwtPayload(null);
    authService.logout();
    // authService.logout() ya redirige a /login
  }, []);

  // ============================================================
  // FUNCIÓN: Refrescar usuario
  // ============================================================
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Si falla, cerrar sesión
      logout();
    }
  }, [logout]);

  // ============================================================
  // VALOR DEL CONTEXTO
  // ============================================================
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    roles,
    permissions,
    isAdmin,
    negocioId,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK: useAuth
// ============================================================
/**
 * Hook para acceder al contexto de autenticación y permisos
 * 
 * @example
 * const { user, login, logout, isAuthenticated, hasPermission } = useAuth();
 * 
 * // Verificar permiso antes de mostrar botón
 * {hasPermission('DELETE_CLIENTS') && (
 *   <button onClick={handleDelete}>Eliminar</button>
 * )}
 * 
 * // Verificar si es admin
 * if (isAdmin) {
 *   // Mostrar opciones de admin
 * }
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;
