'use client';


import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { Cliente, ClienteRequest, ApiError } from '@/lib/types';
import { FormErrorAlert } from '@/components/ui';


// SCHEMA DE VALIDACIÓN CON ZOD
export const clienteSchema = z.object({
    nombreCompleto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    documentoIdentidad: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
    telefono: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres').optional(),
    email: z.string().optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
    initialData?: Cliente | null;
    onSubmit: (data: ClienteRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    showCancelButton?: boolean;
    /** Error del backend para mostrar en el formulario */
    serverError?: ApiError | null;
    /** Callback para limpiar el error del servidor */
    onClearError?: () => void;
}

export function ClienteForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    showCancelButton = true,
    serverError,
    onClearError,
}: ClienteFormProps) {
    const isEditing = !!initialData;
    const form = useForm({
        resolver: zodResolver(clienteSchema),
        defaultValues:{
            nombreCompleto: initialData?.nombreCompleto || '',
            documentoIdentidad: initialData?.documentoIdentidad || '',
            telefono: initialData?.telefono || '',
            email: initialData?.email || '',
        }
    });
    const { register, handleSubmit, formState: { errors } } = form;

    const handleFormSubmit = (data: ClienteFormData) => {
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
            Nombre Completo *
        </label>
        <input
            {...register('nombreCompleto')}
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.nombreCompleto ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            />
        {errors.nombreCompleto && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nombreCompleto.message}
            </p>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Documento de Identidad *
        </label>
        <input
            {...register('documentoIdentidad')}
            type="text" 
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.documentoIdentidad ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            />
        {errors.documentoIdentidad && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.documentoIdentidad.message}
            </p>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono
        </label>
        <input
            {...register('telefono')}
            type="text" 
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.telefono ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-1`}
            />
        {errors.telefono && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.telefono.message}
            </p>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
        </label>
        <input
            {...register('email')}
            type="email"
            className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-1`} />
        {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
            </p>
        )}
        <div className="flex items-center justify-end space-x-2 mt-4">
            {showCancelButton && (
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                    Cancelar
                </button>
            )}
            <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
                {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
        </div>
    </form>
    );
}
export default ClienteForm;
