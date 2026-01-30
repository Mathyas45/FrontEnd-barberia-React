'use client';

/**
 * ============================================================
 * COMPONENTE - FORM ERROR ALERT (REUTILIZABLE)
 * ============================================================
 * 
 * Alert para mostrar errores de validación del backend dentro de formularios.
 * Diseñado para usarse dentro de modales sin cerrarlos.
 * 
 * CARACTERÍSTICAS:
 * - Muestra errores generales y por campo
 * - Estilo consistente con el diseño del sistema
 * - Botón para cerrar/descartar el error
 * - Soporte para dark mode
 * 
 * USO:
 * <FormErrorAlert 
 *   error={apiError}
 *   onDismiss={() => setApiError(null)}
 * />
 * 
 * O con errores parseados:
 * <FormErrorAlert
 *   title="Error de validación"
 *   errors={{ telefono: "El teléfono debe tener entre 9 y 20 caracteres" }}
 *   onDismiss={handleDismiss}
 * />
 */

import { AlertCircle, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApiError, ValidationErrors } from '@/lib/types';
import { parseApiError } from '@/lib/utils';

// ============================================================
// TIPOS
// ============================================================
interface FormErrorAlertProps {
  /** Error del API (se parsea automáticamente) */
  error?: ApiError | null;
  /** Errores ya parseados (alternativa a error) */
  validationErrors?: ValidationErrors | null;
  /** Título personalizado del alert */
  title?: string;
  /** Callback para cerrar/descartar el alert */
  onDismiss?: () => void;
  /** Variante visual */
  variant?: 'error' | 'warning';
  /** Clases CSS adicionales */
  className?: string;
}

// ============================================================
// ESTILOS POR VARIANTE
// ============================================================
const variantStyles = {
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-300',
    text: 'text-red-700 dark:text-red-400',
    dismissBtn: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30',
    fieldBg: 'bg-red-100/50 dark:bg-red-900/30',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-300',
    text: 'text-yellow-700 dark:text-yellow-400',
    dismissBtn: 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800/30',
    fieldBg: 'bg-yellow-100/50 dark:bg-yellow-900/30',
  },
};

// ============================================================
// COMPONENTE
// ============================================================
export function FormErrorAlert({
  error,
  validationErrors,
  title,
  onDismiss,
  variant = 'error',
  className,
}: FormErrorAlertProps) {
  // Parsear el error si viene en formato ApiError
  const parsedErrors = error ? parseApiError(error) : validationErrors;

  // Si no hay errores, no renderizar nada
  if (!parsedErrors || (!parsedErrors.general && Object.keys(parsedErrors.fields).length === 0)) {
    return null;
  }

  const styles = variantStyles[variant];
  const Icon = variant === 'error' ? AlertCircle : AlertTriangle;
  const hasFieldErrors = Object.keys(parsedErrors.fields).length > 0;

  // Determinar el título a mostrar
  const displayTitle = title || (variant === 'error' ? 'Error de validación' : 'Advertencia');

  return (
    <div
      className={cn(
        'relative p-4 border rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300',
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Botón de cerrar */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'absolute top-2 right-2 p-1 rounded-md transition-colors',
            styles.dismissBtn
          )}
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}

      {/* Contenido */}
      <div className="flex gap-3">
        {/* Icono */}
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', styles.icon)} />

        <div className="flex-1 pr-6">
          {/* Título */}
          <h4 className={cn('font-semibold text-sm', styles.title)}>
            {displayTitle}
          </h4>

          {/* Error general */}
          {parsedErrors.general && (
            <p className={cn('mt-1 text-sm', styles.text)}>
              {parsedErrors.general}
            </p>
          )}

          {/* Errores por campo */}
          {hasFieldErrors && (
            <ul className="mt-2 space-y-1">
              {Object.entries(parsedErrors.fields).map(([field, message]) => (
                <li
                  key={field}
                  className={cn(
                    'text-sm px-2 py-1 rounded',
                    styles.fieldBg,
                    styles.text
                  )}
                >
                  <span className="font-medium capitalize">
                    {formatFieldName(field)}:
                  </span>{' '}
                  {message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Formatea el nombre del campo para mostrar (camelCase → Título)
 * Ejemplo: "nombreCompleto" → "Nombre completo"
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    // Separar camelCase
    .replace(/([A-Z])/g, ' $1')
    // Capitalizar primera letra
    .replace(/^./, (str) => str.toUpperCase())
    // Limpiar espacios extra
    .trim();
}

export default FormErrorAlert;
