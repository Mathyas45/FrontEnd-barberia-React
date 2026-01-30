'use client';

/**
 * ============================================================
 * COMPONENTE - FORMULARIO DE PROFESIONAL (REUTILIZABLE)
 * ============================================================
 * 
 * Formulario para crear/editar profesionales.
 * Puede usarse en:
 * - Página de profesionales (modal)
 * - Página de reservas (modal rápido)
 * - Cualquier otro lugar que necesite registrar un profesional
 * 
 * PROPS:
 * - initialData: Datos para edición (si no se pasa, es creación)
 * - onSubmit: Callback cuando se envía el formulario
 * - onCancel: Callback cuando se cancela
 * - isLoading: Estado de carga
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { Profesional, CreateProfesionalDto, UpdateProfesionalDto, ApiError } from '@/lib/types';
import { FormErrorAlert } from '@/components/ui';

// ============================================================
// SCHEMA DE VALIDACIÓN CON ZOD
// ============================================================
export const profesionalSchema = z.object({
  nombreCompleto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  documentoIdentidad: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  usaHorarioNegocio: z.boolean().default(true),
});

// Tipo inferido del schema
export type ProfesionalFormData = z.infer<typeof profesionalSchema>;

// ============================================================
// TIPOS DE PROPS
// ============================================================
interface ProfesionalFormProps {
  /** Datos iniciales para edición (undefined = crear nuevo) */
  initialData?: Profesional | null;
  /** Callback cuando se envía el formulario */
  onSubmit: (data: CreateProfesionalDto | UpdateProfesionalDto) => Promise<void>;
  /** Callback cuando se cancela */
  onCancel: () => void;
  /** Estado de carga del botón */
  isLoading?: boolean;
  /** Mostrar botón de cancelar */
  showCancelButton?: boolean;
  /** Error del backend para mostrar en el formulario */
  serverError?: ApiError | null;
  /** Callback para limpiar el error del servidor */
  onClearError?: () => void;
}

// ============================================================
// COMPONENTE
// ============================================================
export function ProfesionalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  showCancelButton = true,
  serverError,
  onClearError,
}: ProfesionalFormProps) {
  // Determinar si es edición o creación
  const isEditing = !!initialData;

  // React Hook Form con validación Zod
  const form = useForm({
    resolver: zodResolver(profesionalSchema),
    defaultValues: {
      nombreCompleto: initialData?.nombreCompleto || '',
      documentoIdentidad: initialData?.documentoIdentidad || '',
      telefono: initialData?.telefono || '',
      direccion: initialData?.direccion || '',
      fechaNacimiento: initialData?.fechaNacimiento || '',
      usaHorarioNegocio: initialData?.usaHorarioNegocio ?? true,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  // Handler del submit
  const handleFormSubmit = (data: ProfesionalFormData) => {
    // Limpiar error del servidor antes de enviar
    if (onClearError) onClearError();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Alert de errores del servidor */}
      <FormErrorAlert 
        error={serverError} 
        onDismiss={onClearError}
      />

      {/* Nombre Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre Completo *
        </label>
        <input
          {...register('nombreCompleto')}
          type="text"
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${errors.nombreCompleto 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:border-transparent`}
          placeholder="Carlos López"
        />
        {errors.nombreCompleto && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.nombreCompleto.message}
          </p>
        )}
      </div>

      {/* Documento de Identidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Documento de Identidad *
        </label>
        <input
          {...register('documentoIdentidad')}
          type="text"
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${errors.documentoIdentidad 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:border-transparent`}
          placeholder="12345678"
        />
        {errors.documentoIdentidad && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.documentoIdentidad.message}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Teléfono
        </label>
        <input
          {...register('telefono')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          placeholder="987654321"
        />
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección
        </label>
        <input
          {...register('direccion')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          placeholder="Av. Principal 123"
        />
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fecha de Nacimiento
        </label>
        <input
          {...register('fechaNacimiento')}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
        />
      </div>

      {/* Usa Horario del Negocio */}
      <div className="flex items-center gap-2">
        <input
          {...register('usaHorarioNegocio')}
          type="checkbox"
          id="usaHorarioNegocio"
          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded 
            focus:ring-blue-500 bg-white dark:bg-gray-700"
        />
        <label htmlFor="usaHorarioNegocio" className="text-sm text-gray-700 dark:text-gray-300">
          Usa horario del negocio
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {showCancelButton && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`${showCancelButton ? 'flex-1' : 'w-full'} px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
            flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Guardando...
            </>
          ) : (
            isEditing ? 'Actualizar' : 'Crear'
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfesionalForm;
