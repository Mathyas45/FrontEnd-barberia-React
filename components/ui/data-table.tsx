'use client';

/**
 * ============================================================
 * COMPONENTE - DATA TABLE CON TANSTACK TABLE
 * ============================================================
 * 
 * Tabla de datos reutilizable con:
 * - Ordenamiento por columnas
 * - Filtro/Búsqueda global
 * - Paginación
 * - Exportación a PDF y Excel
 * - Soporte para dark mode
 * 
 * CÓMO USAR:
 * 1. Define las columnas con columnHelper
 * 2. Pasa los datos como prop
 * 3. Opcionalmente configura exportación
 */

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronsLeft, 
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================
interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  showExport?: boolean;
  exportFileName?: string;
  pageSize?: number;
  isLoading?: boolean;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = 'Buscar...',
  showSearch = true,
  showPagination = true,
  showExport = true,
  exportFileName = 'datos',
  pageSize = 10,
  isLoading = false,
  onExportPDF,
  onExportExcel,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Configurar tabla
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* ========== TOOLBAR ========== */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Búsqueda */}
        {showSearch && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        )}

        {/* Botones de exportación */}
        {showExport && (
          <div className="flex gap-2">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 
                  bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 
                  rounded-lg transition-colors"
              >
                <FileSpreadsheet size={18} />
                <span className="hidden sm:inline">Excel</span>
              </button>
            )}
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 
                  bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 
                  rounded-lg transition-colors"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========== TABLA ========== */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          {/* Header */}
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-semibold"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        
                        {/* Indicador de ordenamiento */}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: <ChevronUp size={14} />,
                              desc: <ChevronDown size={14} />,
                            }[header.column.getIsSorted() as string] ?? (
                              <div className="opacity-0 group-hover:opacity-50">
                                <ChevronUp size={14} />
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              // Loading state
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando datos...</p>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No hay datos para mostrar</p>
                </td>
              </tr>
            ) : (
              // Data rows
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINACIÓN ========== */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Info de registros */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            de {table.getFilteredRowModel().rows.length} registros
          </p>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Número de página */}
            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
