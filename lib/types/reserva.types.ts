/**
 * ============================================================
 * TIPOS - RESERVA
 * ============================================================
 * Representa las citas/reservas de los clientes.
 */

import type { AuditFields, RegEstado } from './common.types';
import type { ProfesionalResumen } from './profesional.types';
import type { ServicioResumen } from './servicio.types';

/**
 * Estados posibles de una reserva
 */
export type EstadoReserva = 
  | 'PENDIENTE'    // Recién creada, esperando confirmación
  | 'CONFIRMADA'   // Confirmada por el negocio
  | 'EN_PROGRESO'  // Cliente está siendo atendido
  | 'COMPLETADA'   // Servicio terminado
  | 'CANCELADA'    // Cancelada por cliente o negocio
  | 'NO_ASISTIO';  // Cliente no se presentó

/**
 * Entidad Reserva completa
 */
export interface Reserva extends AuditFields {
  id: number;
  fechaHora: string; // ISO 8601: "2024-01-20T10:30:00"
  estado: EstadoReserva;
  notas?: string;
  
  // Datos del cliente (puede no estar registrado)
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  
  // Relaciones
  profesional: ProfesionalResumen;
  servicio: ServicioResumen;
}

/**
 * DTO para crear una reserva (desde web pública)
 */
export interface CreateReservaDto {
  fechaHora: string;
  profesionalId: number;
  servicioId: number;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  notas?: string;
}

/**
 * DTO para actualizar una reserva
 */
export interface UpdateReservaDto {
  fechaHora?: string;
  profesionalId?: number;
  servicioId?: number;
  estado?: EstadoReserva;
  notas?: string;
  regEstado?: RegEstado;
}

/**
 * Filtros para buscar reservas
 */
export interface ReservaFilters {
  fechaInicio?: string;
  fechaFin?: string;
  profesionalId?: number;
  estado?: EstadoReserva;
}
