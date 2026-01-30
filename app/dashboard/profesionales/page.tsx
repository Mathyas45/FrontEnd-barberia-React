'use client';//esto se pone para que sea un componente del lado del cliente, es decir, que pueda usar hooks de react como useState o useEffect, cliente se refiere a navegador

/**
 * ============================================================
 * PÁGINA - PROFESIONALES (CRUD Completo)
 * ============================================================
 * 
 * Gestión completa de profesionales con:
 * - Tabla con TanStack Table
 * - Búsqueda en BACKEND (no solo filtro de tabla)
 * - Modal para crear/editar usando componente reutilizable
 * - Modal de confirmación para eliminar
 * - Exportación a PDF y Excel
 * - Soporte completo para dark mode
 * - RBAC: Botones visibles según permisos del usuario
 * 
 * CAMBIOS IMPORTANTES:
 * - El formulario está en components/forms/profesional-form.tsx (REUTILIZABLE)
 * - La búsqueda usa el backend: GET /profesionales?query=texto
 */

import { useState, useMemo, useCallback } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useProfesionales } from '@/lib/hooks';
import { useAuth } from '@/lib/context'; // Hook para verificar permisos
import { showSuccess, showError, isValidationError } from '@/lib/utils';
import { DataTable, SearchInput } from '@/components/ui';
import { Modal, ConfirmModal } from '@/components/ui/modal';
import { ProfesionalForm } from '@/components/forms';
import { exportToPDF, exportToExcel } from '@/lib/utils';
import type { Profesional, CreateProfesionalDto, UpdateProfesionalDto, ApiError } from '@/lib/types';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw
} from 'lucide-react';

// ============================================================
// COLUMN HELPER PARA LA TABLA
// ============================================================
const columnHelper = createColumnHelper<Profesional>();

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ProfesionalesPage() {
  // Hook de profesionales (incluye búsqueda en backend)
  const { 
    profesionales,
    loading,
    error,
    searchQuery,
    refetch,
    search,
    clearSearch,
    createProfesional,
    updateProfesional,
    deleteProfesional 
  } = useProfesionales();

  // ============================================================
  // RBAC: Verificar permisos del usuario
  // ============================================================
  const { hasPermission } = useAuth();
  
  const canCreate = hasPermission('CREATE_PROFESSIONALS');
  const canUpdate = hasPermission('UPDATE_PROFESSIONALS');
  const canDelete = hasPermission('DELETE_PROFESSIONALS');

  // Estados para modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado para errores del servidor (validación del backend)
  const [serverError, setServerError] = useState<ApiError | null>(null);

  // Estado para búsqueda (input controlado)
  const [searchInput, setSearchInput] = useState('');

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
    // Solo mostrar columna de acciones si tiene algún permiso de acción
    ...(canUpdate || canDelete ? [
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <div className="flex items-center gap-2">
            {/* Botón Editar - Solo si tiene permiso UPDATE_PROFESSIONALS */}
            {canUpdate && (
              <button
                onClick={() => handleEdit(info.row.original)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
            )}
            {/* Botón Eliminar - Solo si tiene permiso DELETE_PROFESSIONALS */}
            {canDelete && (
              <button
                onClick={() => handleDeleteClick(info.row.original)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ),
      }),
    ] : []),
  ], [canUpdate, canDelete]);

  // ============================================================
  // HANDLERS DE BÚSQUEDA (usa SearchInput reutilizable)
  // ============================================================
  
  // Buscar (el componente envía el query, si está vacío lista todos)
  const handleSearch = useCallback((query: string) => {
    if (query) {
      search(query);
    } else {
      clearSearch();
    }
  }, [search, clearSearch]);

  // Limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    clearSearch();
  }, [clearSearch]);

  // ============================================================
  // HANDLERS DE MODALES
  // ============================================================
  
  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedProfesional(null);
    setShowFormModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (profesional: Profesional) => {
    setSelectedProfesional(profesional);
    setShowFormModal(true);
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (profesional: Profesional) => {
    setSelectedProfesional(profesional);
    setShowDeleteModal(true);
  };

  // Cerrar modal de formulario
  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedProfesional(null);
    setServerError(null); // Limpiar errores al cerrar
  };

  // ============================================================
  // HANDLERS DE CRUD
  // ============================================================
  
  // Enviar formulario (crear o editar) - Recibe datos del ProfesionalForm
  const handleFormSubmit = async (data: CreateProfesionalDto | UpdateProfesionalDto) => {
    setIsSubmitting(true);
    setServerError(null); // Limpiar errores previos
    
    try {
      if (selectedProfesional) {
        await updateProfesional(selectedProfesional.id, data as UpdateProfesionalDto);
        showSuccess('Profesional actualizado correctamente');
      } else {
        await createProfesional(data as CreateProfesionalDto);
        showSuccess('Profesional creado correctamente');
      }
      // Solo cerrar si fue exitoso
      handleCloseFormModal();
    } catch (err) {
      const apiError = err as ApiError;
      
      // Si es error de validación, mostrar en el formulario (no cerrar modal)
      if (isValidationError(apiError)) {
        setServerError(apiError);
      } else {
        // Para otros errores, mostrar toast
        showError(apiError.message || 'Error al guardar el profesional');
      }
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
      showSuccess('Profesional eliminado correctamente');
      setShowDeleteModal(false);
      setSelectedProfesional(null);
    } catch (err) {
      const apiError = err as ApiError;
      showError(apiError.message || 'Error al eliminar el profesional');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // HANDLERS DE EXPORTACIÓN
  // ============================================================
  
  const exportColumns = [
    { header: 'Nombre', accessorKey: 'nombreCompleto' },
    { header: 'Documento', accessorKey: 'documentoIdentidad' },
    { header: 'Teléfono', accessorKey: 'telefono' },
    { header: 'Dirección', accessorKey: 'direccion' },
  ];

  const handleExportExcel = () => {
    exportToExcel(profesionales, exportColumns, 'profesionales');
  };

  const handleExportPDF = () => {
    exportToPDF(profesionales, exportColumns, 'profesionales', 'Lista de Profesionales');
  };

  // ============================================================
  // RENDER, es decir la parte JSX que se muestra en pantalla
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

          {/* Botón Crear - Solo si tiene permiso CREATE_PROFESSIONALS */}
          {canCreate && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Profesional</span>
            </button>
          )}
        </div>
      </div>

      {/* ========== BARRA DE BÚSQUEDA (componente reutilizable) ========== */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Buscar por nombre o documento..."
          isLoading={loading}
          searchQuery={searchQuery}
          resultCount={profesionales.length}
        />
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
            {searchQuery ? 'No se encontraron resultados' : 'No hay profesionales'}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `No hay profesionales que coincidan con "${searchQuery}"`
              : 'Empieza agregando tu primer profesional'
            }
          </p>
          {searchQuery ? (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Limpiar búsqueda
            </button>
          ) : canCreate && (
            <button
              onClick={handleCreate}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Profesional
            </button>
          )}
        </div>
      )}

      {/* ========== DATA TABLE ========== */}
      {!error && (profesionales.length > 0 || loading) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <DataTable
            columns={columns}
            data={profesionales}
            isLoading={loading}
            showSearch={false}
            showExport={true} 
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />
        </div>
      )}

      {/* ========== MODAL: CREAR/EDITAR (usa componente reutilizable) ========== */}
      <Modal
        isOpen={showFormModal}
        onClose={handleCloseFormModal}
        title={selectedProfesional ? 'Editar Profesional' : 'Nuevo Profesional'}
        size="md"
      >
        <ProfesionalForm
          initialData={selectedProfesional}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isLoading={isSubmitting}
          serverError={serverError}
          onClearError={() => setServerError(null)}
        />
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
