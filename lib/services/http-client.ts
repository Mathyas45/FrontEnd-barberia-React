/**
 * ============================================================
 * CLIENTE HTTP BASE
 * ============================================================
 * Configuración centralizada de Axios para todas las llamadas al API.
 * 
 * CARACTERÍSTICAS:
 * - Interceptor para agregar token JWT automáticamente
 * - Manejo centralizado de errores
 * - Configuración de base URL desde env
 * 
 * NUNCA hagas llamadas HTTP directamente con fetch o axios.
 * Siempre usa este cliente o los servicios que lo usan.
 */

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { envConfig } from '@/lib/config';
import type { ApiError } from '@/lib/types';

/**
 * Crea y configura la instancia de Axios
 */
function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: envConfig.apiUrl,
    timeout: 30000, // 30 segundos
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ============================================================
  // INTERCEPTOR DE REQUEST
  // ============================================================
  // Agrega el token JWT a todas las peticiones (si existe)
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Solo en cliente (browser)
      if (typeof window !== 'undefined') {
        // Leemos el token de la COOKIE (única fuente de verdad)
        const token = getTokenFromCookie();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Lee el token de la cookie auth_token
   */
  function getTokenFromCookie(): string | null {
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
  // INTERCEPTOR DE RESPONSE
  // ============================================================
  // Maneja errores de forma centralizada
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      // Error de red o timeout
      if (!error.response) {
        const networkError: ApiError = {
          message: 'Error de conexión. Verifica tu internet.',
          status: 0,
        };
        return Promise.reject(networkError);
      }

      const { status, data } = error.response;

      // Token expirado o inválido (401 o 403)
      if (status === 401 || status === 403) {
        // Solo en cliente
        if (typeof window !== 'undefined') {
          // Limpiar cookie de autenticación
          document.cookie = 'auth_token=; path=/; max-age=0';
          // Limpiar datos de usuario (esto sí puede estar en localStorage)
          localStorage.removeItem(envConfig.auth.userKey);
          // Redirigir a login
          window.location.href = '/login';
        }
      }

      // Construir error consistente (preservando formato del backend)
      // El backend envía: { error, errors, status, timestamp }
      const apiError: ApiError = {
        message: data?.message || data?.error || getDefaultErrorMessage(status),
        error: data?.error,           // Preservar el tipo de error del backend
        status,
        code: data?.code,
        timestamp: data?.timestamp,   // Preservar timestamp del backend
        errors: data?.errors,         // Preservar errores de validación por campo
      };

      return Promise.reject(apiError);
    }
  );

  return client;
}

/**
 * Mensajes de error por defecto según status HTTP
 */
function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Datos inválidos. Revisa el formulario.',
    401: 'Sesión expirada. Inicia sesión nuevamente.',
    403: 'No tienes permiso para realizar esta acción.',
    404: 'Recurso no encontrado.',
    409: 'Ya existe un registro con estos datos.',
    422: 'Error de validación.',
    500: 'Error interno del servidor.',
  };
  return messages[status] || 'Ocurrió un error inesperado.';
}

// Exporta una única instancia (singleton)
export const httpClient = createHttpClient();
