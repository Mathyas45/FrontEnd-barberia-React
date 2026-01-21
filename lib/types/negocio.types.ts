/**
 * ============================================================
 * TIPOS - NEGOCIO (Business/Tenant)
 * ============================================================
 * Representa cada barbería/negocio independiente.
 * Es la entidad principal del sistema multi-tenant.
 */

import type { AuditFields } from './common.types';

/**
 * Entidad Negocio completa
 */
export interface Negocio extends AuditFields {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
  razonSocial?: string;
  ruc?: string;
}

/**
 * DTO para crear un negocio
 */
export interface CreateNegocioDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
  razonSocial?: string;
  ruc?: string;
}

/**
 * DTO para actualizar un negocio
 */
export interface UpdateNegocioDto extends Partial<CreateNegocioDto> {}

/**
 * Negocio resumido (para selects, referencias)
 */
export interface NegocioResumen {
  id: number;
  nombre: string;
  logo?: string;
}
