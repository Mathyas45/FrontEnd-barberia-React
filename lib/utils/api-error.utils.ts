/**
 * ============================================================
 * UTILIDADES DE MANEJO DE ERRORES DEL API
 * ============================================================
 * 
 * Funciones para parsear y manejar errores que vienen del backend.
 * El backend envía errores en este formato:
 * 
 * {
 *   error: "Error de validación",
 *   errors: { telefono: "El teléfono debe tener entre 9 y 20 caracteres" },
 *   status: 400,
 *   timestamp: "2026-01-29T20:25:25.084961"
 * }
 * 
 * Estas utilidades convierten ese formato a uno más fácil de usar en la UI.
 */

import type { ApiError, ValidationErrors } from '@/lib/types';

/**
 * Parsea un error del API y extrae los errores de validación.
 * Convierte el formato del backend a un formato más fácil de usar en formularios.
 * 
 * @param error - Error del API (puede venir de http-client o directamente del catch)
 * @returns Objeto con errores parseados { general, fields }
 * 
 * @example
 * const parsed = parseApiError(error);
 * // { 
 * //   general: "Error de validación", 
 * //   fields: { telefono: "El teléfono debe tener entre 9 y 20 caracteres" } 
 * // }
 */
export function parseApiError(error: ApiError | unknown): ValidationErrors {
  // Si no es un objeto, retornar error genérico
  if (!error || typeof error !== 'object') {
    return {
      general: 'Ocurrió un error inesperado',
      fields: {},
    };
  }

  const apiError = error as ApiError;

  // Extraer errores de campo
  const fields: Record<string, string> = {};
  
  if (apiError.errors) {
    for (const [field, errorValue] of Object.entries(apiError.errors)) {
      // El error puede ser string o array de strings
      if (Array.isArray(errorValue)) {
        fields[field] = errorValue.join('. ');
      } else if (typeof errorValue === 'string') {
        fields[field] = errorValue;
      }
    }
  }

  // Determinar el mensaje general
  // Prioridad: error (del backend) > message > mensaje por defecto según status
  const general = apiError.error 
    || apiError.message 
    || getDefaultErrorMessage(apiError.status);

  return {
    general: Object.keys(fields).length > 0 ? null : general, // Si hay errores de campo, no mostrar el general
    fields,
  };
}

/**
 * Verifica si el error es un error de validación (status 400 o 422)
 * Útil para decidir si mantener el modal abierto o cerrarlo
 * 
 * @param error - Error a verificar
 * @returns true si es un error de validación
 */
export function isValidationError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  
  const apiError = error as ApiError;
  return apiError.status === 400 || apiError.status === 422;
}

/**
 * Verifica si el error tiene errores de campo específicos
 * 
 * @param error - Error a verificar
 * @returns true si hay errores de validación por campo
 */
export function hasFieldErrors(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  
  const apiError = error as ApiError;
  return !!apiError.errors && Object.keys(apiError.errors).length > 0;
}

/**
 * Obtiene un mensaje de error legible para mostrar en un toast
 * Si hay errores de campo, los combina en un mensaje
 * 
 * @param error - Error del API
 * @returns Mensaje de error para toast
 */
export function getErrorMessage(error: unknown): string {
  const parsed = parseApiError(error);
  
  // Si hay errores de campo, combinarlos
  if (Object.keys(parsed.fields).length > 0) {
    const fieldErrors = Object.values(parsed.fields).join('. ');
    return `Error de validación: ${fieldErrors}`;
  }
  
  return parsed.general || 'Ocurrió un error inesperado';
}

/**
 * Obtiene el mensaje de error por defecto según el código HTTP
 */
function getDefaultErrorMessage(status?: number): string {
  if (!status) return 'Ocurrió un error inesperado';
  
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

/**
 * Extrae los errores de campo para usarlos con react-hook-form setError
 * 
 * @param error - Error del API
 * @returns Array de objetos { name, message } para usar con setError
 * 
 * @example
 * const fieldErrors = extractFieldErrors(error);
 * fieldErrors.forEach(({ name, message }) => {
 *   form.setError(name, { type: 'server', message });
 * });
 */
export function extractFieldErrors(error: unknown): Array<{ name: string; message: string }> {
  const parsed = parseApiError(error);
  
  return Object.entries(parsed.fields).map(([name, message]) => ({
    name,
    message,
  }));
}
