/**
 * ============================================================
 * UTILIDADES - FECHAS
 * ============================================================
 * Funciones helpers para manejo de fechas con dayjs.
 */

import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Configurar español como idioma por defecto
dayjs.locale('es');

/**
 * Formatea fecha para mostrar
 */
export function formatFecha(fecha: string | Date, formato = 'DD/MM/YYYY'): string {
  return dayjs(fecha).format(formato);
}

/**
 * Formatea fecha y hora
 */
export function formatFechaHora(fecha: string | Date): string {
  return dayjs(fecha).format('DD/MM/YYYY HH:mm');
}

/**
 * Formatea solo hora
 */
export function formatHora(fecha: string | Date): string {
  return dayjs(fecha).format('HH:mm');
}

/**
 * Obtiene fecha en formato ISO para enviar al API
 */
export function toISODate(fecha: Date): string {
  return dayjs(fecha).format('YYYY-MM-DD');
}

/**
 * Obtiene fecha y hora en formato ISO
 */
export function toISODateTime(fecha: Date): string {
  return dayjs(fecha).toISOString();
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(fecha: string | Date): boolean {
  return dayjs(fecha).isSame(dayjs(), 'day');
}

/**
 * Verifica si una fecha es pasada
 */
export function isPast(fecha: string | Date): boolean {
  return dayjs(fecha).isBefore(dayjs());
}

/**
 * Obtiene el inicio del día
 */
export function startOfDay(fecha: Date = new Date()): Date {
  return dayjs(fecha).startOf('day').toDate();
}

/**
 * Obtiene el fin del día
 */
export function endOfDay(fecha: Date = new Date()): Date {
  return dayjs(fecha).endOf('day').toDate();
}

export { dayjs };
