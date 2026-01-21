'use client';

/**
 * ============================================================
 * PÁGINA - PROFESIONALES (CRUD Completo)
 * ============================================================
 * 
 * Gestión completa de profesionales con:
 * - Tabla con TanStack Table
 * - Búsqueda y ordenamiento
 * - Modal para crear/editar (mismo componente)
 * - Modal de confirmación para eliminar
 * - Exportación a PDF y Excel
 * - Soporte completo para dark mode
 */

import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useProfesionales } from '@/lib/hooks';
import { DataTable } from '@/components/ui/data-table';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { exportToPDF, exportToExcel } from '@/lib/utils';
import type { Profesional, CreateProfesionalDto, UpdateProfesionalDto } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw,
  Loader2
} from 'lucide-react';

// ============================================================
// SCHEMA DE VALIDACIÓN CON ZOD
// ============================================================
const profesionalSchema = z.object({
  nombreCompleto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  documentoIdentidad: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  usaHorarioNegocio: z.boolean().optional().default(true),
});

type ProfesionalFormData = z.infer<typeof profesionalSchema>;

// ============================================================
// COLUMN HELPER PARA LA TABLA
// ============================================================
const columnHelper = createColumnHelper<Profesional>();

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ProfesionalesPage() {
  // Hook de profesionales
  const { 
    profesionales,
    loading,
    error,
    refetch,
    createProfesional,
    updateProfesional,
    deleteProfesional 
  } = useProfesionales();

  // Estados para modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profesionalSchema),
    defaultValues: {
      nombreCompleto: '',
      documentoIdentidad: '',
      telefono: '',
      direccion: '',
      usaHorarioNegocio: true,
    },
  });

  // ============================================================
  // DEFINICIÓN DE COLUMNAS
  // ============================================================
  const columns = useMemo(() => [
    columnHelper.accessor('nombreCompleto', {
      header: 'Nombre',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {info.getValue().charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('documentoIdentidad', {
      header: 'Documento',
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('telefono', {
      header: 'Teléfono',
      cell: (info) => info.getValue() || <span className="text-gray-400 dark:text-gray-500">-</span>,
    }),
    columnHelper.accessor('direccion', {
      header: 'Dirección',
      cell: (info) => info.getValue() || <span className="text-gray-400 dark:text-gray-500">-</span>,
    }),
    columnHelper.accessor('usaHorarioNegocio', {
      header: 'Horario',
      cell: (info) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          info.getValue()
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
        }`}>
          {info.getValue() ? 'Negocio' : 'Personalizado'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(info.row.original)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ], []);

  // ============================================================
  // HANDLERS
  // ============================================================
  
  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedProfesional(null);
    reset({
      nombreCompleto: '',
      documentoIdentidad: '',
      telefono: '',
      direccion: '',
      usaHorarioNegocio: true,
    });
    setShowFormModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (profesional: Profesional) => {
    setSelectedProfesional(profesional);
    reset({
      nombreCompleto: profesional.nombreCompleto,
      documentoIdentidad: profesional.documentoIdentidad,
      telefono: profesional.telefono || '',
      direccion: profesional.direccion || '',
      usaHorarioNegocio: profesional.usaHorarioNegocio,
    });
    setShowFormModal(true);
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (profesional: Profesional) => {
    setSelectedProfesional(profesional);
    setShowDeleteModal(true);
  };

  // Enviar formulario (crear o editar)
  const onSubmit = async (data: ProfesionalFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedProfesional) {
        // Editar
        await updateProfesional(selectedProfesional.id, data as UpdateProfesionalDto);
      } else {
        // Crear
        await createProfesional(data as CreateProfesionalDto);
      }
      setShowFormModal(false);
      reset();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedProfesional) return;
    setIsSubmitting(true);
    try {
      await deleteProfesional(selectedProfesional.id);
      setShowDeleteModal(false);
      setSelectedProfesional(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exportar a Excel
  const handleExportExcel = () => {
    const exportColumns = [
      { header: 'Nombre', accessorKey: 'nombreCompleto' },
      { header: 'Documento', accessorKey: 'documentoIdentidad' },
      { header: 'Teléfono', accessorKey: 'telefono' },
      { header: 'Dirección', accessorKey: 'direccion' },
    ];
    exportToExcel(profesionales, exportColumns, 'profesionales');
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    const exportColumns = [
      { header: 'Nombre', accessorKey: 'nombreCompleto' },
      { header: 'Documento', accessorKey: 'documentoIdentidad' },
      { header: 'Teléfono', accessorKey: 'telefono' },
      { header: 'Dirección', accessorKey: 'direccion' },
    ];
    exportToPDF(profesionales, exportColumns, 'profesionales', 'Lista de Profesionales');
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-blue-600" />
            Profesionales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los barberos y profesionales de tu negocio
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón Recargar */}
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            title="Recargar lista"
          >
            <RefreshCw size={20} className={`text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Botón Crear */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
              hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Profesional</span>
          </button>
        </div>
      </div>

      {/* ========== ERROR STATE ========== */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400 font-medium">Error al cargar datos</p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ========== EMPTY STATE ========== */}
      {!loading && !error && profesionales.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No hay profesionales
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Empieza agregando tu primer profesional
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agregar Profesional
          </button>
        </div>
      )}

      {/* ========== DATA TABLE ========== */}
      {!error && (profesionales.length > 0 || loading) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <DataTable
            columns={columns}
            data={profesionales}
            isLoading={loading}
            searchPlaceholder="Buscar profesional..."
            showExport={true}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />
        </div>
      )}

      {/* ========== MODAL: CREAR/EDITAR ========== */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={selectedProfesional ? 'Editar Profesional' : 'Nuevo Profesional'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombreCompleto.message}</p>
            )}
          </div>

          {/* Documento */}
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
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.documentoIdentidad.message}</p>
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
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                selectedProfesional ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========== MODAL: CONFIRMAR ELIMINACIÓN ========== */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Profesional"
        message={`¿Estás seguro de eliminar a "${selectedProfesional?.nombreCompleto}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
