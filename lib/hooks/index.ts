/**
 * ============================================================
 * BARREL EXPORT - HOOKS
 * ============================================================
 * Exporta todos los hooks desde un solo punto.
 * 
 * USO: import { useProfesionales } from '@/lib/hooks';
 * 
 * CUANDO CREES UN NUEVO HOOK:
 * 1. Crea el archivo use-[entidad].ts
 * 2. Agrega la exportación aquí
 */

export { useProfesionales } from './use-profesionales';
export { useCategorias } from './use-categorias';
export { useServicios } from './use-servicios';
export { useThemeToggle } from './use-theme-toggle';
export { useClientes } from './use-clientes';
export { usePermissions } from './use-permissions';


