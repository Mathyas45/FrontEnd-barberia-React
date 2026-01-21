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
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Error del API
 */
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  errors?: Record<string, string[]>;
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
