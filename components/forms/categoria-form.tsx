'use client';

import { useForm } from 'react-hook-form';//esto sirve para manejar formularios en React
import { zodResolver } from '@hookform/resolvers/zod';//esto conecta Zod con React Hook Form para validación
import { z } from 'zod';//esto es una biblioteca para validación de esquemas
import { Loader2 } from 'lucide-react';//esto es un ícono de carga
import type { Categoria, CategoriaRequest, ApiError } from '@/lib/types';//importa tipos relacionados con categorías
import { FormErrorAlert } from '@/components/ui';


export const categoriaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  estado: z.boolean().default(true),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;// esto infiere el tipo de datos del formulario a partir del esquema de Zod, es decir, crea un tipo basado en las reglas definidas en categoriaSchema.

interface CategoriaFormProps {
    initialData?: Categoria | null;
    onSubmit: (data: CategoriaRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    showCancelButton?: boolean;
    /** Error del backend para mostrar en el formulario */
    serverError?: ApiError | null;
    /** Callback para limpiar el error del servidor */
    onClearError?: () => void;
}

export function CategoriaForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    showCancelButton = true,
    serverError,
    onClearError,
}: CategoriaFormProps) {
    const isEditing = !!initialData;

    const form = useForm({
        resolver: zodResolver(categoriaSchema),
        defaultValues:{
            nombre: initialData?.nombre || '',
            descripcion: initialData?.descripcion || '',
            estado: initialData?.estado ?? true,
        }
    });

    const { register, handleSubmit, formState: { errors } } = form;

    const handleFormSubmit = (data: CategoriaFormData) => {
        // Limpiar error del servidor antes de enviar
        if (onClearError) onClearError();
        onSubmit(data);
    }

    return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Alert de errores del servidor */}
        <FormErrorAlert 
            error={serverError} 
            onDismiss={onClearError}
        />

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre *
        </label>
        <input
            {...register('nombre')}
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.nombre  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {errors.nombre && (
            <p className="text-sm text-red-600 mt-1 dark:text-red-500">{errors.nombre.message}</p>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
            {...register('descripcion')}
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.descripcion ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            rows={4}
        />
        {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1 dark:text-red-500">{errors.descripcion.message}</p>
        )}
        <div className="flex items-center space-x-2">
            <input
                {...register('estado')}
                type="checkbox"
                id="estado"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked={initialData?.estado ?? true}
            />
            <label htmlFor="estado" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Activo
            </label>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-4 border-t border-gray-200 dark:border-gray-700">
            {showCancelButton && (
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                disabled={isLoading}
            >
                Cancelar
            </button>
            )}
            <button
            type="submit"
            disabled={isLoading}
            className={`${showCancelButton ? 'flex-1' : 'w-full'} px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
            flex items-center justify-center gap-2`}            >
            {isLoading ? (
                <>
                <Loader2 size={18} className="h-5 w-5 mr-2 animate-spin" />
                Guardando...
                </>
            ) : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
        </div>
    </form>
    );
}
export default CategoriaForm;//esto es para exportar el componente y poder usarlo en otras partes de la aplicación.