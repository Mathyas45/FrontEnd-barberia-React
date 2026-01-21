/**
 * ============================================================
 * HOOK - useServicios
 * ============================================================
 * Hook para manejar el estado de servicios de la barbería.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { servicioService } from '@/lib/services';
import type { Servicio, ApiError } from '@/lib/types';

interface UseServiciosState {
  servicios: Servicio[];
  loading: boolean;
  error: ApiError | null;
}

interface UseServiciosReturn extends UseServiciosState {
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener lista de servicios activos
 */
export function useServicios(): UseServiciosReturn {
  const [state, setState] = useState<UseServiciosState>({
    servicios: [],
    loading: true,
    error: null,
  });

  const fetchServicios = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await servicioService.getAllActive();
      setState({ servicios: data, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  return {
    ...state,
    refetch: fetchServicios,
  };
}
