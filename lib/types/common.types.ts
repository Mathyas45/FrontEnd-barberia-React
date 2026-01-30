/**
 * ============================================================
 * TIPOS COMUNES
 * ============================================================
 * Tipos genéricos reutilizables en todo el proyecto.
 */

/**
 * Respuesta genérica del API para listados paginados
 */
export interface ApiPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual (0-based)
  first: boolean;
  last: boolean;
}

/**
 * Respuesta genérica del API
 * Formato: { code: 200, success: true, message: "...", data: ... }
 */
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

/**
 * Error del API (compatible con formato del backend)
 * 
 * El backend envía errores en este formato:
 * {
 *   error: "Error de validación",
 *   errors: { campo: "mensaje de error" },
 *   status: 400,
 *   timestamp: "2026-01-29T20:25:25.084961"
 * }
 */
export interface ApiError {
  message: string;           // Mensaje general del error
  error?: string;            // Tipo de error del backend (ej: "Error de validación")
  code?: string;
  status: number;
  timestamp?: string;        // Timestamp del backend
  errors?: Record<string, string | string[]>; // Errores de validación por campo
}

/**
 * Errores de validación parseados para mostrar en formularios
 */
export interface ValidationErrors {
  general: string | null;    // Error general (no asociado a un campo)
  fields: Record<string, string>; // Errores por campo
}

/**
 * Estado base de todas las entidades
 * 1 = activo, 0 = inactivo
 */
export type RegEstado = 0 | 1;

/**
 * Campos de auditoría que tienen todas las entidades
 */
export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  regEstado: RegEstado;
}

/**
 * Parámetros comunes para consultas paginadas
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
