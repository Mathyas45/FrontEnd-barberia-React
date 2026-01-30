/**
 * ============================================================
 * SERVICIO DE AUTENTICACIÓN
 * ============================================================
 * 
 * Maneja todas las operaciones de autenticación:
 * - Login (obtener token)
 * - Logout (limpiar token)
 * - Verificar sesión
 * - Obtener usuario actual
 * 
 * FLUJO DE LOGIN:
 * 1. Usuario envía email + password
 * 2. Backend valida y retorna { token, usuario }
 * 3. Guardamos token en COOKIE (única fuente de verdad)
 *    - El middleware lo lee para proteger rutas
 *    - El httpClient lo lee para enviarlo en peticiones
 * 4. Guardamos usuario en localStorage (solo datos, no token)
 * 5. Redirigimos al dashboard
 * 
 * ¿POR QUÉ SOLO COOKIE PARA EL TOKEN?
 * - Una única fuente de verdad (no duplicamos datos)
 * - El middleware (servidor) puede leerla
 * - JavaScript del cliente también puede leerla
 * - Más seguro: puedes agregar HttpOnly en producción
 * 
 * IMPORTANTE: Este servicio NO usa httpClient para login
 * porque el interceptor agregaría un token que no existe aún.
 */

import axios from 'axios';
import { envConfig } from '@/lib/config';
import { setAuthCookie, removeAuthCookie, getAuthCookie } from '@/lib/utils';
import type { LoginRequest, LoginResponse, Usuario } from '@/lib/types';

// Key para datos de usuario en localStorage (el token está en cookie)
const USER_KEY = 'barberia_user';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Realiza el login y guarda el token
   * @param credentials - Email y password
   * @returns Datos del usuario autenticado
   * 
   * El backend puede responder en dos formatos:
   * 1. Directo: { token, usuario }
   * 2. Envuelto: { code, success, message, data: { token, usuario } }
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
        credentials.email = credentials.email.toLowerCase();
        credentials.password = credentials.password.trim();
      // Usamos axios directamente sin interceptor
      const response = await axios.post(
        `${envConfig.apiUrl}/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',//esto indica que el cuerpo de la solicitud está en formato JSON
          },
        }
      );

      // Manejar ambos formatos de respuesta
      let loginData: LoginResponse;
      if (response.data.data) {
        // Formato envuelto: { code, success, message, data: { token, usuario } }
        loginData = response.data.data;
      } else {
        // Formato directo: { token, usuario }
        loginData = response.data;
      }

      const { token, usuario } = loginData;

      // Guardar token SOLO en cookie (única fuente de verdad)
      // - El middleware lo lee para proteger rutas
      // - El httpClient lo lee para enviarlo en cada petición
      setAuthCookie(token);
      
      // Guardar datos del usuario en localStorage (solo datos, no el token)
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));

      return loginData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Error al iniciar sesión';
        throw new Error(message);
      }
      throw new Error('Error de conexión. Verifica que el servidor esté activo.');
    }
  },

  /**
   * Cierra la sesión y limpia los datos
   */
  logout(): void {
    // Limpiar cookie del token (única fuente de verdad)
    removeAuthCookie();
    
    // Limpiar datos del usuario de localStorage
    localStorage.removeItem(USER_KEY);
    
    // Redirigir a login
    window.location.href = '/login';
  },

  /**
   * Obtiene el token guardado (de la cookie)
   * @returns Token o null si no existe
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return getAuthCookie();
  },

  /**
   * Obtiene el usuario guardado
   * @returns Usuario o null si no existe
   */
  getUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as Usuario;
    } catch {
      return null;
    }
  },

  /**
   * Verifica si hay una sesión activa
   * @returns true si hay token guardado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },

  /**
   * Obtiene el usuario actual desde el backend
   * Útil para verificar que el token sigue válido
   */
  async getCurrentUser(): Promise<Usuario> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    try {
      const response = await axios.get<Usuario>(
        `${envConfig.apiUrl}/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Actualizar usuario guardado
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      // Si falla, probablemente el token expiró
      this.logout();
      throw new Error('Sesión expirada');
    }
  },
};

export default authService;
