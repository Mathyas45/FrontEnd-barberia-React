/**
 * ============================================================
 * BARREL EXPORT - TYPES
 * ============================================================
 * Exporta todos los tipos desde un solo punto.
 * 
 * USO: import { Profesional, CreateProfesionalDto } from '@/lib/types';
 * 
 * CUANDO CREES UN NUEVO TIPO:
 * 1. Crea el archivo [entidad].types.ts
 * 2. Agrega la exportación aquí
 */

// Tipos genéricos (siempre necesarios)
export * from './common.types';

// Entidades del sistema
export * from './negocio.types';
export * from './profesional.types';  // ⭐ EJEMPLO COMPLETO
export * from './auth.types';
export * from './servicio.types';
export * from './reserva.types';
export * from './categoria.types';
export * from './clientes.types';

