/**
 * ============================================================
 * TIPOS - AUTENTICACIÓN
 * ============================================================
 * Tipos relacionados con login, usuarios y permisos.
 */

import type { NegocioResumen } from './negocio.types';

/**
 * Roles del sistema
 */
export type RolNombre = 
  | 'SUPER_ADMIN'   // Acceso total a todo el sistema
  | 'ADMIN'         // Admin de un negocio específico
  | 'PROFESIONAL'   // Barbero/profesional
  | 'RECEPCIONISTA';// Solo gestión de citas

export interface Rol {
  id: number;
  nombre: RolNombre;
  descripcion?: string;
}

/**
 * Usuario autenticado
 */
export interface Usuario {
  id: number;
  email: string;
  nombreCompleto: string;
  telefono?: string;
  activo: boolean;
  negocio: NegocioResumen;
  rol: Rol;
}

/**
 * Request de login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response de login
 */
export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

/**
 * Request de registro
 */
export interface RegisterRequest {
  email: string;
  password: string;
  nombreCompleto: string;
  telefono?: string;
  negocioId?: number; // Si se une a un negocio existente
}

/**
 * Datos decodificados del JWT (para referencia)
 */
export interface JwtPayload {
  sub: string; // email
  negocioId: number;
  rol: RolNombre;
  exp: number;
  iat: number;
}
