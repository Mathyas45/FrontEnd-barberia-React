
'use client'; // Necesario en Next.js para hooks del cliente

import { useState, useEffect, useCallback } from 'react';   
import { categoriaService } from '@/lib/services';
import type { Categoria, CategoriaRequest, ApiError } from '@/lib/types';


/**
 * Estado interno del hook
 */
interface UseCategoriasState {
  categorias: Categoria[];
  loading: boolean;
  error: ApiError | null;
  searchQuery: string; 
}

/**
 * Lo que retorna el hook (estado + funciones)
 */
interface UseCategoriasReturn extends UseCategoriasState {
    refetch: () => Promise<void>;
    search: (query: string) => Promise<void>; 
    clearSearch: () => Promise<void>; 
    createCategoria: (data: CategoriaRequest) => Promise<Categoria>;
    updateCategoria: (id: number, data: CategoriaRequest) => Promise<Categoria>;
    deleteCategoria: (id: number) => Promise<void>;
}

export function useCategorias(): UseCategoriasReturn {  

    const[state, setState] = useState<UseCategoriasState>({
        categorias: [],
        loading: true,
        error: null,
        searchQuery: '', 
    });

    const fetchCategorias = useCallback(async (query?: string) => {
       setState(prev => ({ ...prev, loading: true, error: null }));
       try {
           const categorias = await categoriaService.getAll(query);

            setState({
                categorias,
                loading: false,
                error: null,
                searchQuery: query || '',
            });
       } catch (err) {
           setState(prev => ({
               ...prev,
               loading: false,
               error: err as ApiError,
            }));
        }
    }, []);

     // FUNCIÓN PARA BUSCAR (usa el backend)
    const search = useCallback(async (query: string) => {
        await fetchCategorias(query);
    }, [fetchCategorias]);

    // FUNCIÓN PARA LIMPIAR BÚSQUEDA
    const clearSearch = useCallback(async () => {
        await fetchCategorias();
    }, [fetchCategorias]);

    // FUNCIÓN PARA CREAR
    const createCategoria = useCallback(async (data: CategoriaRequest): Promise<Categoria> => {
        const nueva =  await categoriaService.create(data);
        // Después de crear, recargamos la lista
        await fetchCategorias();
        return nueva;
    }, [fetchCategorias]);

    // FUNCIÓN PARA ACTUALIZAR
    const updateCategoria = useCallback(async (id: number, data: CategoriaRequest): Promise<Categoria> => {
        const actualizada =  await categoriaService.update(id, data);
        // Después de actualizar, recargamos la lista
        await fetchCategorias();
        return actualizada;
    }, [fetchCategorias]);

    // FUNCIÓN PARA ELIMINAR
    const deleteCategoria = useCallback(async (id: number): Promise<void> => {
        await categoriaService.delete(id);
        // Después de eliminar, recargamos la lista
        await fetchCategorias();
    }, [fetchCategorias]);
    // Carga inicial
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    return {
        ...state,
        refetch: fetchCategorias,
        search,
        clearSearch,
        createCategoria,
        updateCategoria,
        deleteCategoria,
    };
}