"use client"; // Necesario en Next.js para hooks del cliente

import { useState, useMemo, useCallback } from "react"; //hooks de react, useState para manejar estado, useMemo para memorizar valores y useCallback para memorizar funciones
import { createColumnHelper } from "@tanstack/react-table"; //funcion para crear columnas de una tabla tanstack
import { useClientes } from "@/lib/hooks";  //hook personalizado para manejar clientes
import { useAuth } from "@/lib/context"; // Hook para verificar permisos
import { DataTable, SearchInput } from '@/components/ui'; //componente de tabla reutilizable
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { ClienteForm } from "@/components/forms/cliente-form"; //formulario para crear/editar clientes
import { exportToPDF, exportToExcel, isValidationError } from "@/lib/utils";
import type { Cliente, ClienteRequest, ApiError } from "@/lib/types";
import { showSuccess, showError } from '@/lib/utils';//showSuccess y showError para mostrar notificaciones
import {  
  Users,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react'; //iconos

const columnHelper = createColumnHelper<Cliente>(); //crea un ayudante de columnas para la tabla de clientes

export default function ClientesPage() {//esto sirve para manejar la página de clientes en el dashboard, es decir, la interfaz donde se muestran y gestionan los clientes.
    const {
        clientes,
        loading,
        error,
        searchQuery,
        refetch,
        search,
        clearSearch,
        createCliente,
        updateCliente,
        deleteCliente,
    } = useClientes();

    // ============================================================
    // RBAC: Verificar permisos del usuario
    // ============================================================
    const { hasPermission } = useAuth();
    
    // Permisos específicos para esta vista
    const canCreate = hasPermission('CREATE_CLIENTS');
    const canUpdate = hasPermission('UPDATE_CLIENTS');
    const canDelete = hasPermission('DELETE_CLIENTS');

    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);//cliente seleccionado para editar o eliminar, se obtiene al hacer clic en editar o eliminar   

    const [isSubmitting, setIsSubmitting] = useState(false);
    // Estado para errores del servidor (validación del backend)
    const [serverError, setServerError] = useState<ApiError | null>(null);
    // Estado para búsqueda (input controlado)
    const [searchInput, setSearchInput] = useState("");

    // DEFINICIÓN DE COLUMNAS
    const columns = useMemo(() => [
        columnHelper.accessor('nombreCompleto', {
            header: 'Nombre Completo',
            cell: info => info.getValue(),
            // size : 200,
        }),
        columnHelper.accessor('documentoIdentidad', {
            header: 'Documento',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('telefono', {
            header: 'Teléfono',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => info.getValue() || '-',
        }),
        // Solo mostrar columna de acciones si tiene algún permiso de acción
        ...(canUpdate || canDelete ? [
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                cell: info => {
                    const cliente = info.row.original;
                    return (
                        <div className="flex space-x-2">
                            {/* Botón Editar - Solo si tiene permiso UPDATE_CLIENTS */}
                            {canUpdate && (
                                <button 
                                    onClick={() => handleEdit(cliente)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar Cliente"
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                            {/* Botón Eliminar - Solo si tiene permiso DELETE_CLIENTS */}
                            {canDelete && (
                                <button 
                                    onClick={() => handleDeleteClick(cliente)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar Cliente"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                },
            }),
        ] : []),
    ], [canUpdate, canDelete]);

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
        setSelectedCliente(null);
        setShowFormModal(true);
    }

    // Abrir modal para editar
    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setShowFormModal(true);
    }

    // Abrir modal para eliminar
    const handleDeleteClick = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setShowDeleteModal(true);
    }

     // Cerrar modal de formulario
     const handleCloseFormModal = () => {
        setShowFormModal(false);
        setSelectedCliente(null);
        setServerError(null); // Limpiar errores al cerrar
    };

    const handleConfirmDelete = async () => {
        if (!selectedCliente) return;
        setIsSubmitting(true);
        try {
            await deleteCliente(selectedCliente.id);
            showSuccess('Cliente eliminado exitosamente.');
            setShowDeleteModal(false);
            setSelectedCliente(null);
        } catch (err) {
            const apiError = err as ApiError;
            showError(apiError.message || 'Error al eliminar el cliente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Crear o actualizar cliente
    const handleFormSubmit = async (data: ClienteRequest) => {
        setIsSubmitting(true);
        setServerError(null); // Limpiar errores previos
        
        try {
            if (selectedCliente) {
                // Actualizar cliente
                await updateCliente(selectedCliente.id, data);
                showSuccess('Cliente actualizado exitosamente.');
            } else {
                // Crear cliente
                await createCliente(data);
                showSuccess('Cliente creado exitosamente.');
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
                showError(apiError.message || 'Ocurrió un error inesperado.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

     // Exportacion
    const exportColumns = [
        { header: 'Nombre Completo', accessorKey: 'nombreCompleto' },
        { header: 'Documento de Identidad', accessorKey: 'documentoIdentidad' },
        { header: 'Teléfono', accessorKey: 'telefono' },
        { header: 'Email', accessorKey: 'email' },
    ];
    const handleExportExcel = () => {
        exportToExcel(clientes, exportColumns, 'clientes.xlsx');
    };

    const handleExportPDF = () => {
        exportToPDF(clientes, exportColumns, 'Clientes', 'clientes.pdf');
    };
   


     //contenido del componente
   return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-blue-600" /> Clientes 
            <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
              {clientes.length}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Gestione los clientes de su negocio aquí.</p>
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
        {/* Botón Crear - Solo si tiene permiso CREATE_CLIENTS */}
        {canCreate && (
            <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                    hover:bg-blue-700 transition-colors font-medium">
                <Plus size={20} />
                <span className="hidden sm:inline">Crear Cliente</span>
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
            placeholder="Buscar clientes..."
            isLoading={loading}
            searchQuery={searchQuery}
            resultCount={clientes.length}
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
      {!loading && !error && clientes.length === 0 && (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchQuery ? 'No se encontraron resultados' : 'No hay clientes aún'}
            </h3>
           <p className="mt-2 text-gray-600 dark:text-gray-400">
            {searchQuery 
              ? `No hay clientes que coincidan con "${searchQuery}". Intente con otro término de búsqueda.`
              : 'Comience agregando nuevos clientes para verlos aquí.'}
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
                Agregar Cliente
            </button>
          )}
        </div>
        )}
        {/* ========== TABLA DE DATOS (componente reutilizable) ========== */}
        {!error && ( clientes.length > 0) && (
        <DataTable
            columns={columns}
            data={clientes}
            isLoading={loading}
            showSearch={false}
            showExport={true}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
        />
        )}
        {/* ========== MODAL FORMULARIO ========== */}
         <Modal
        isOpen={showFormModal}
        onClose={handleCloseFormModal}
        title={selectedCliente ? 'Editar Cliente' : 'Crear Cliente'}>
        <ClienteForm
            initialData={selectedCliente || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseFormModal}
            isLoading={isSubmitting}
            serverError={serverError}
            onClearError={() => setServerError(null)}
        />
      </Modal>
      {/* ========== MODAL CONFIRMACIÓN ELIMINAR ========== */}
       <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        message={`¿Está seguro de que desea eliminar al cliente "${selectedCliente?.nombreCompleto}"? Esta acción no se puede deshacer.`}
        isLoading={isSubmitting}
      />
    </div>
  );
        
  }