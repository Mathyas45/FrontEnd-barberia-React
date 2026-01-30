"use client"; // Necesario en Next.js para hooks del cliente

import { useState, useMemo, useCallback } from "react"; //hooks de react, useState para manejar estado, useMemo para memorizar valores y useCallback para memorizar funciones
import { createColumnHelper } from "@tanstack/react-table"; //funcion para crear columnas de una tabla tanstack
import { useCategorias } from "@/lib/hooks"; //hook personalizado para manejar categorias
import { useAuth } from "@/lib/context"; // Hook para verificar permisos
import { DataTable, SearchInput } from '@/components/ui'; //componente de tabla reutilizable
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { CategoriaForm } from "@/components/forms";
import { exportToPDF, exportToExcel, isValidationError } from "@/lib/utils";
import type { Categoria, CategoriaRequest, ApiError } from "@/lib/types";
import { showSuccess, showError } from '@/lib/utils';//showSuccess y showError para mostrar notificaciones
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  X,
} from "lucide-react"; //iconos de lucide-react
const columnHelper = createColumnHelper<Categoria>(); //crea un ayudante de columnas para la tabla de categorias

export default function CategoriasPage() {
  const {
    categorias,
    loading,
    error,
    searchQuery,
    refetch,
    search,
    clearSearch,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  } = useCategorias();

  // ============================================================
  // RBAC: Verificar permisos del usuario
  // ============================================================
  const { hasPermission } = useAuth();
  
  const canCreate = hasPermission('CREATE_CATEGORIES');
  const canUpdate = hasPermission('UPDATE_CATEGORIES');
  const canDelete = hasPermission('DELETE_CATEGORIES');

  // Estados para modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado para errores del servidor (validación del backend)
  const [serverError, setServerError] = useState<ApiError | null>(null);
  // Estado para búsqueda (input controlado)
  const [searchInput, setSearchInput] = useState("");

  // DEFINICIÓN DE COLUMNAS
  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        header: "Nombre",
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
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            info.getValue() ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {info.getValue() ? 'Activo' : 'Inactivo'}
        </span>),
      }),
      // Solo mostrar columna de acciones si tiene algún permiso de acción
      ...(canUpdate || canDelete ? [
        columnHelper.display({
          id: "acciones",
          header: "Acciones",
          cell: (info) => {
            const categoria = info.row.original;
            return (
              <div className="flex gap-2">
                {/* Botón Editar - Solo si tiene permiso UPDATE_CATEGORIES */}
                {canUpdate && (
                  <button
                    onClick={() => handleEdit(info.row.original)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {/* Botón Eliminar - Solo si tiene permiso DELETE_CATEGORIES */}
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
            );
          },
        }),
      ] : []),
    ],
    [canUpdate, canDelete],
  );

  // Buscar (el componente envía el query, si está vacío lista todos)
  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        search(query);
      } else {
        clearSearch();
      }
    },
    [search, clearSearch],
  );

  // Limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    clearSearch();
  }, [clearSearch]);

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedCategoria(null);
    setShowFormModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowFormModal(true);
  };
  // Abrir modal para eliminar
  const handleDeleteClick = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowDeleteModal(true);
  };
  // Cerrar modal de formulario
  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedCategoria(null);
    setServerError(null); // Limpiar errores al cerrar
  };
  
  const handleFormSubmit = async (data: CategoriaRequest) => {
    setIsSubmitting(true);
    setServerError(null); // Limpiar errores previos
    
    try {
      if (selectedCategoria) {
        await updateCategoria(selectedCategoria.id, data);
        showSuccess('Categoría actualizada con éxito');
      } else {
        await createCategoria(data);
        showSuccess('Categoría creada con éxito');
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
        showError(apiError.message || 'Error al guardar categoría');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedCategoria) return;
    setIsSubmitting(true);
    
    try {
      await deleteCategoria(selectedCategoria.id);
      showSuccess('Categoría eliminada con éxito');
      setShowDeleteModal(false);
      setSelectedCategoria(null);
    } catch (err) {
      const apiError = err as ApiError;
      showError(apiError.message || 'Error al eliminar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exportacion
  const exportColumns = [
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Descripción", accessorKey: "descripcion" },
    { header: "Estado", accessorKey: "estado" },
  ];

  const handleExportExcel = () => {
    const processedCategorias = categorias.map((categoria) => ({
      ...categoria,//esto copia todas las propiedades de la categoría original
      estado: categoria.estado ? "Activo" : "Inactivo",
    }));
    exportToExcel(processedCategorias, exportColumns, "categorias.xlsx");
  };
  const handleExportPDF = () => {
    const processedCategorias = categorias.map((categoria) => ({
      ...categoria,//esto copia todas las propiedades de la categoría original
      estado: categoria.estado ? "Activo" : "Inactivo",
    }));
    exportToPDF(processedCategorias, exportColumns, "categorias.pdf");
  };

  //contenido del componente
   return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-blue-600" />
            Categorías
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gestión de categorías de servicios
            </p>
        </div>
        <div className="flex flex-wrap gap-2">
        {/* Botón Recargar */}
        <button
            onClick={refetch}
            disabled={loading}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            title="Recargar lista">
            <RefreshCw size={20} className={`text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>  
         {/* Botón Crear - Solo si tiene permiso CREATE_CATEGORIES */}
        {canCreate && (
          <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                  hover:bg-blue-700 transition-colors font-medium">
              <Plus size={20} />
              <span className="hidden sm:inline">Crear Categoría</span>
          </button>
        )}
        </div>
      </div>
    {/* ========== BARRA DE BÚSQUEDA (componente reutilizable) ========== */ }
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Buscar categorías por nombre..."
            isLoading={loading}
            searchQuery={searchQuery}
            resultCount={categorias.length}
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
      {!loading && !error && categorias.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchQuery ? 'No se encontraron resultados' : 'No hay categorías registradas'}
          </h3>
           <p className="mt-2 text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `No hay categorías que coincidan con "${searchQuery}".`:
                'Comienza creando una nueva categoría para tus servicios.'}
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
              Agregar Categoría
            </button>
          )}
        </div>
      )}
       {/* ========== DATA TABLE ========== */}
      {!error && (categorias.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <DataTable
            columns={columns}
            data={categorias}
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
        title={selectedCategoria ? 'Editar Categoría' : 'Crear Categoría'}>
        <CategoriaForm
            initialData={selectedCategoria || undefined}
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
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${selectedCategoria?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );

}
