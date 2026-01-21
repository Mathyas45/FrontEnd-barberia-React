/**
 * ============================================================
 * UTILIDADES - CN (classNames)
 * ============================================================
 * Función para combinar clases de Tailwind de forma limpia.
 * Muy útil cuando usas shadcn/ui o componentes condicionales.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind evitando conflictos
 * 
 * Ejemplo:
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // Resultado: 'py-2 px-6 bg-blue-500' (px-6 reemplaza px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
