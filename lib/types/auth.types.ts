/**
 * ============================================================
 * TIPOS - AUTENTICACIÓN Y PERMISOS (RBAC)
 * ============================================================
 * Tipos relacionados con login, usuarios, roles y permisos.
 * 
 * RBAC = Role-Based Access Control
 * - Los ROLES definen grupos de usuarios (ADMIN, PROFESIONAL, etc.)
 * - Los PERMISOS definen acciones específicas (CREATE_CLIENTS, READ_BOOKING, etc.)
 * 
 * ⚠️ IMPORTANTE: TODO es DINÁMICO
 * - Roles y permisos vienen del backend en el JWT
 * - Pueden agregarse nuevos desde formularios
 * - El frontend NO hardcodea valores
 * - El backend indica si el usuario tiene acceso total via `isAdmin` o permiso `FULL_ACCESS`
 */

import type { NegocioResumen } from './negocio.types';

// ============================================================
// PERMISOS DEL SISTEMA (DINÁMICOS)
// ============================================================

/**
 * Permiso del sistema - Es un STRING porque es dinámico
 * 
 * Los permisos vienen del backend y pueden cambiar/agregarse.
 * Ejemplos: 'CREATE_CLIENTS', 'READ_BOOKING', 'MANAGE_SETTINGS'
 * 
 * Permiso especial:
 * - 'FULL_ACCESS' o '*' = Acceso total (bypass de verificación)
 */
export type Permission = string;

/**
 * Permiso especial que indica acceso total
 * Si el JWT contiene este permiso, el usuario puede hacer todo
 */
export const FULL_ACCESS_PERMISSION = 'FULL_ACCESS';

// ============================================================
// ROLES DEL SISTEMA (DINÁMICOS)
// ============================================================

/**
 * Rol del sistema - Es un STRING porque es dinámico
 * 
 * Los roles vienen del backend y pueden crearse nuevos.
 * Ejemplos: 'ADMIN', 'PROFESIONAL', 'RECEPCIONISTA', 'GERENTE'
 */
export type RolNombre = string;

export interface Rol {
  id: number;
  nombre: RolNombre;
  descripcion?: string;
}

// ============================================================
// USUARIO
// ============================================================

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

// ============================================================
// JWT PAYLOAD
// ============================================================

/**
 * Datos decodificados del JWT
 * El token contiene roles, permisos Y si es admin
 */
export interface JwtPayload {
  sub: string;           // email del usuario
  usuarioId: number;     // ID del usuario
  negocioId: number;     // ID del negocio
  roles: RolNombre[];    // Array de roles (ej: ["ADMIN"])
  permissions: Permission[]; // Array de permisos
  isAdmin?: boolean;     // ⭐ El BACKEND indica si tiene acceso total
  exp: number;           // Timestamp de expiración
  iat: number;           // Timestamp de creación
}

// ============================================================
// AUTH REQUESTS/RESPONSES
// ============================================================

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

// ============================================================
// CONFIGURACIÓN DE RUTAS Y PERMISOS
// ============================================================

/**
 * Configuración de una ruta protegida
 * Define qué permisos se necesitan para acceder
 */
export interface RoutePermission {
  path: string;
  permissions: Permission[];
  /** Si true, necesita TODOS los permisos. Si false, cualquiera */
  requireAll?: boolean;
}
