/**
 * ============================================================
 * UTILIDADES DE TOAST - SONNER
 * ============================================================
 * 
 * Funciones reutilizables para mostrar notificaciones toast usando sonner.
 * Centraliza la configuración y estilos de los toasts para toda la aplicación.
 * 
 * USO BÁSICO:
 * import { showSuccess, showError, showPromise } from '@/lib/utils/toast.utils';
 * 
 * showSuccess('Guardado correctamente');
 * showError('Error al guardar');
 * showPromise(saveData(), {
 *   loading: 'Guardando...',
 *   success: 'Guardado',
 *   error: 'Error'
 * });
 */

import { toast } from 'sonner';

// ============================================================
// TIPOS
// ============================================================
type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

interface PromiseMessages<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
}

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  description?: string;
}

// ============================================================
// CONFIGURACIÓN POR DEFECTO
// ============================================================
const DEFAULT_DURATION = 3000; // 3 segundos

// ============================================================
// FUNCIONES DE TOAST
// ============================================================

/**
 * Muestra un toast de éxito (verde)
 * @example showSuccess('Profesional creado correctamente')
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    description: options?.description,
  });
};

/**
 * Muestra un toast de error (rojo)
 * @example showError('Error al guardar el profesional')
 */
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    duration: options?.duration ?? 4000, // Errores duran más
    description: options?.description,
  });
};

/**
 * Muestra un toast de advertencia (amarillo)
 * @example showWarning('El profesional ya existe')
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    description: options?.description,
  });
};

/**
 * Muestra un toast informativo (azul)
 * @example showInfo('Recuerda guardar los cambios')
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    duration: options?.duration ?? DEFAULT_DURATION,
    description: options?.description,
  });
};

/**
 * Muestra un toast con estado de promesa (loading → success/error)
 * ¡MUY ÚTIL! Muestra automáticamente el loading y luego el resultado
 * 
 * @example
 * showPromise(
 *   createProfesional(data),
 *   {
 *     loading: 'Creando profesional...',
 *     success: 'Profesional creado correctamente',
 *     error: 'Error al crear el profesional'
 *   }
 * );
 */
export const showPromise = <T>(
  promise: Promise<T>,
  messages: PromiseMessages<T>,
  options?: ToastOptions
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: options?.duration ?? DEFAULT_DURATION,
  });
};

/**
 * Muestra un toast con acción (botón)
 * Útil para acciones como "Deshacer"
 * 
 * @example
 * showWithAction('Profesional eliminado', {
 *   label: 'Deshacer',
 *   onClick: () => restoreProfesional(id)
 * });
 */
export const showWithAction = (
  message: string,
  action: { label: string; onClick: () => void },
  options?: ToastOptions
) => {
  toast(message, {
    duration: options?.duration ?? 5000, // Más tiempo para que el usuario pueda hacer click
    action: {
      label: action.label,
      onClick: action.onClick,
    },
  });
};

/**
 * Cierra todos los toasts activos
 * @example dismissAll() // Cierra todo
 */
export const dismissAll = () => {
  toast.dismiss();
};

/**
 * Cierra un toast específico por ID
 * @example
 * const toastId = toast.loading('Cargando...');
 * // ...después
 * dismissToast(toastId);
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// ============================================================
// EXPORTAR TOAST ORIGINAL PARA CASOS AVANZADOS
// ============================================================
export { toast };
