'use client';

/**
 * ============================================================
 * COMPONENTE REUTILIZABLE - SearchInput
 * ============================================================
 * 
 * Buscador con conexión al backend. Incluye:
 * - Input con ícono de búsqueda
 * - Botón X para limpiar
 * - Botón "Buscar"
 * - Enter para buscar
 * - Mensaje de resultados
 * 
 * USO:
 * ```tsx
 * <SearchInput
 *   value={searchInput}
 *   onChange={setSearchInput}
 *   onSearch={handleSearch}
 *   onClear={handleClear}
 *   placeholder="Buscar..."
 *   isLoading={loading}
 *   resultCount={items.length}
 *   searchQuery={currentQuery}
 * />
 * ```
 */

import { useCallback } from 'react';
import { Search, X } from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================
interface SearchInputProps {
  /** Valor actual del input */
  value: string;
  /** Función para actualizar el valor */
  onChange: (value: string) => void;
  /** Función que se ejecuta al buscar (Enter o click en botón) */
  onSearch: (query: string) => void;
  /** Función para limpiar la búsqueda */
  onClear: () => void;
  /** Placeholder del input */
  placeholder?: string;
  /** Si está cargando (deshabilita el botón) */
  isLoading?: boolean;
  /** Query actual aplicado (para mostrar mensaje) */
  searchQuery?: string;
  /** Cantidad de resultados (para mostrar mensaje) */
  resultCount?: number;
  /** Texto del botón */
  buttonText?: string;
  /** Mostrar el botón de buscar */
  showButton?: boolean;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

// ============================================================
// COMPONENTE
// ============================================================
export function SearchInput({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  isLoading = false,
  searchQuery = '',
  resultCount,
  buttonText = 'Buscar',
  showButton = true,
  className = '',
}: SearchInputProps) {
  
  // Manejar búsqueda
  const handleSearch = useCallback(() => {
    const trimmed = value.trim();
    onSearch(trimmed); // Si está vacío, el padre decide qué hacer
  }, [value, onSearch]);

  // Manejar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Manejar limpiar
  const handleClear = () => {
    onChange('');
    onClear();
  };

  // Mostrar botón X si hay texto o hay query activo
  const showClearButton = value || searchQuery;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Input + Botón */}
      <div className="flex gap-2">
        {/* Input con íconos */}
        <div className="relative flex-1">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
          {showClearButton && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Limpiar búsqueda"
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Botón Buscar */}
        {showButton && (
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              whitespace-nowrap"
            type="button"
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Mensaje de resultados */}
      {searchQuery && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando resultados para: <span className="font-medium">&quot;{searchQuery}&quot;</span>
          {resultCount !== undefined && (
            <span> ({resultCount} encontrados)</span>
          )}
        </p>
      )}
    </div>
  );
}

export default SearchInput;
