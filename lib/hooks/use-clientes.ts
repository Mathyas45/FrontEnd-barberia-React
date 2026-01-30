
'use client'; // Necesario en Next.js para hooks del cliente

import { useState, useEffect, useCallback } from 'react';//useState para estado(clientes, loading, error), useEffect para carga inicial, useCallback para funciones memoizadas
import { clienteService } from '@/lib/services';
import type { Cliente, ClienteRequest, ApiError } from '@/lib/types';

interface UseClientesState {
  clientes: Cliente[];
  loading: boolean;
  error: ApiError | null;
  searchQuery: string; 
}

interface UseClientesReturn extends UseClientesState {
    refetch: () => Promise<void>;
    search: (query: string) => Promise<void>; 
    clearSearch: () => Promise<void>; 
    createCliente: (data: ClienteRequest) => Promise<Cliente>;
    updateCliente: (id: number, data: ClienteRequest) => Promise<Cliente>;
    deleteCliente: (id: number) => Promise<void>;
}

export function useClientes(): UseClientesReturn {
    const[state, setState] = useState<UseClientesState>({//state es el estado interno del hook y setState la función para actualizarlo
        clientes: [],
        loading: true,
        error: null,
        searchQuery: '', 
    });

    const fetchClientes = useCallback(async (query?: string) => {
       setState(prev => ({ ...prev, loading: true, error: null }));
         try {
              const clientes = await clienteService.getAll(query);
                setState({
                    clientes,
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
        await fetchClientes(query);
    }, [fetchClientes]);

    // FUNCIÓN PARA LIMPIAR BÚSQUEDA
    const clearSearch = useCallback(async () => {
        await fetchClientes();
    }, [fetchClientes]);

    // REFETCH MANUAL
    const refetch = useCallback(async () => {
        await fetchClientes(state.searchQuery || undefined);
    }, [fetchClientes, state.searchQuery]);

    // CREAR CLIENTE
    const createCliente = useCallback(async (data: ClienteRequest) => {
        const newCliente =  await clienteService.create(data);
        //Actualizar estado local
        setState(prev => ({//prev es el estado anterior
            ...prev,
            clientes: [newCliente, ...prev.clientes],//agrega el nuevo cliente al inicio de la lista
        }));
        return newCliente;
    }, []);

    // ACTUALIZAR CLIENTE
    const updateCliente = useCallback(async (id: number, data: ClienteRequest) => {
        const updated = await clienteService.update(id, data);
        //Actualizar estado local
        setState(prev => ({
            ...prev,
            clientes: prev.clientes.map(c => c.id === id ? updated : c),
        }));
        return updated;
    }, []);

    // ELIMINAR CLIENTE
    const deleteCliente = useCallback(async (id: number) => {
        await clienteService.delete(id);
        //Actualizar estado local
        setState(prev => ({
            ...prev,
            clientes: prev.clientes.filter(c => c.id !== id),
        }));
    }, []);

    // Carga inicial
    useEffect(() => {//useEffect para cargar los clientes al montar el componente, useEffect depende de fetchClientes, useEffect lo que hace es llamar a fetchClientes y actualizar el estado
        fetchClientes();
    }, [fetchClientes]);
    return {
        ...state,
        refetch,    
        search,
        clearSearch,
        createCliente,
        updateCliente,
        deleteCliente,
    };
}


