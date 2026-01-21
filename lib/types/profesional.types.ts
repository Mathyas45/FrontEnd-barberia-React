/**
 * ============================================================
 * TIPOS - PROFESIONAL
 * ============================================================
 * Representa a los barberos/profesionales que atienden.
 * 
 * IMPORTANTE: Estos tipos deben coincidir con el backend.
 * Ver CONTEXTO_PARA_FRONTEND.md para más detalles.
 */

import type { AuditFields, RegEstado } from './common.types';

/**
 * Días de la semana (como los maneja el backend)
 */
export type DiaSemana = 
  | 'LUNES' 
  | 'MARTES' 
  | 'MIERCOLES' 
  | 'JUEVES' 
  | 'VIERNES' 
  | 'SABADO' 
  | 'DOMINGO';

/**
 * Horario de un profesional para un día específico
 */
export interface HorarioProfesional {
  id: number;
  profesionalId: number;
  diaSemana: DiaSemana;
  horaInicio: string; // "09:00"
  horaFin: string;    // "18:00"
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Entidad Profesional completa (según backend)
 */
export interface Profesional extends AuditFields {
  id: number;
  nombreCompleto: string;
  documentoIdentidad: string;
  fechaNacimiento?: string; // "1990-05-15"
  telefono?: string;
  direccion?: string;
  usaHorarioNegocio: boolean;
  negocioId: number;
}

/**
 * DTO para crear un profesional
 */
export interface CreateProfesionalDto {
  nombreCompleto: string;
  documentoIdentidad: string;
  fechaNacimiento?: string;
  telefono?: string;
  direccion?: string;
  usaHorarioNegocio?: boolean;
}

/**
 * DTO para actualizar un profesional
 */
export interface UpdateProfesionalDto extends Partial<CreateProfesionalDto> {
  regEstado?: RegEstado;
}

/**
 * DTO para crear/actualizar horario
 */
export interface HorarioDto {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  activo?: boolean;
}

/**
 * Profesional resumido (para selects, cards públicas)
 */
export interface ProfesionalResumen {
  id: number;
  nombreCompleto: string;
}
