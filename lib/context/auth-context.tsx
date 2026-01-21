'use client';

/**
 * ============================================================
 * CONTEXTO DE AUTENTICACIÓN
 * ============================================================
 * 
 * Provee el estado de autenticación a toda la aplicación.
 * 
 * ¿QUÉ ES UN CONTEXT?
 * - Es una forma de pasar datos a través del árbol de componentes
 * - Sin necesidad de pasar props manualmente en cada nivel
 * - Perfecto para datos "globales" como: usuario, tema, idioma
 * 
 * CÓMO SE USA:
 * 1. Envolver la app con <AuthProvider>
 * 2. Usar el hook useAuth() en cualquier componente
 * 
 * EJEMPLO:
 * const { user, isLoading, login, logout } = useAuth();
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  type ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import type { Usuario, LoginRequest } from '@/lib/types';

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

  // ============================================================
  // EFECTO: Verificar sesión al cargar
  // ============================================================
  useEffect(() => {
    const initAuth = () => {
      try {
        // Intentar recuperar usuario de localStorage
        const savedUser = authService.getUser();
        const token = authService.getToken();

        if (savedUser && token) {
          setUser(savedUser);
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
 * Hook para acceder al contexto de autenticación
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * // En un componente:
 * if (!isAuthenticated) {
 *   return <LoginForm onSubmit={login} />;
 * }
 * return <Dashboard user={user} />;
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;
