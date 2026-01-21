/**
 * ============================================================
 * BARREL EXPORT - SERVICES
 * ============================================================
 * Exporta todos los servicios desde un solo punto.
 * 
 * USO: import { profesionalService } from '@/lib/services';
 * 
 * CUANDO CREES UN NUEVO SERVICE:
 * 1. Crea el archivo [entidad].service.ts
 * 2. Agrega la exportación aquí
 */

export { httpClient } from './http-client';
export { profesionalService } from './profesional.service';
export { servicioService } from './servicio.service';
export { reservaService } from './reserva.service';

