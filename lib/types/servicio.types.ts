/**
 * ============================================================
 * TIPOS - SERVICIO
 * ============================================================
 * Representa los servicios que ofrece la barbería.
 * Ejemplo: Corte clásico, Barba, Afeitado, etc.
 */

import type { AuditFields, RegEstado } from './common.types';

/**
 * Entidad Servicio completa
 */
export interface Servicio extends AuditFields {
  id: number;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
  imagen?: string;
}

/**
 * DTO para crear un servicio
 */
export interface CreateServicioDto {
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  precio: number;
  imagen?: string;
}

/**
 * DTO para actualizar un servicio
 */
export interface UpdateServicioDto extends Partial<CreateServicioDto> {
  regEstado?: RegEstado;
}

/**
 * Servicio resumido (para selects, cards)
 */
export interface ServicioResumen {
  id: number;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

/**
 * Formato de precio helper
 */
export function formatPrecio(precio: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
  }).format(precio);
}

/**
 * Formato de duración helper
 */
export function formatDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
}
