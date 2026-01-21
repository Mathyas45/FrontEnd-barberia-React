/**
 * ============================================================
 * HOOK - useProfesionales
 * ============================================================
 * Hook personalizado para manejar el estado de profesionales.
 * 
 * ¿QUÉ ES UN HOOK?
 * - Es una función que te permite "enganchar" funcionalidad de React
 * - Los hooks personalizados empiezan con "use"
 * - Encapsulan lógica reutilizable (estado, efectos, llamadas API)
 * 
 * ¿POR QUÉ USAR HOOKS?
 * - Mantiene los componentes limpios (solo UI)
 * - La lógica es reutilizable en múltiples componentes
 * - Fácil de testear
 */

'use client'; // Necesario en Next.js para hooks del cliente

import { useState, useEffect, useCallback } from 'react';
import { profesionalService } from '@/lib/services';
import type { Profesional, CreateProfesionalDto, ApiError } from '@/lib/types';

/**
 * Estado interno del hook
 */
interface UseProfesionalesState {
  profesionales: Profesional[];
  loading: boolean;
  error: ApiError | null;
}

/**
 * Lo que retorna el hook (estado + funciones)
 */
interface UseProfesionalesReturn extends UseProfesionalesState {
  refetch: () => Promise<void>;
  createProfesional: (data: CreateProfesionalDto) => Promise<Profesional>;
  deleteProfesional: (id: number) => Promise<void>;
}

/**
 * Hook para gestionar profesionales
 * 
 * EJEMPLO DE USO:
 * ```tsx
 * function MiComponente() {
 *   const { profesionales, loading, error, refetch } = useProfesionales();
 *   
 *   if (loading) return <div>Cargando...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <ul>
 *       {profesionales.map(p => <li key={p.id}>{p.nombreCompleto}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useProfesionales(): UseProfesionalesReturn {
  // ============================================================
  // ESTADO
  // ============================================================
  // useState: guarda valores que pueden cambiar y re-renderizar el componente
  const [state, setState] = useState<UseProfesionalesState>({
    profesionales: [],
    loading: true,
    error: null,
  });

  // ============================================================
  // FUNCIÓN PARA CARGAR DATOS
  // ============================================================
  // useCallback: memoriza la función para que no se re-cree en cada render
  const fetchProfesionales = useCallback(async () => {
    // Indicamos que está cargando
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Llamamos al servicio (que llama al API)
      const data = await profesionalService.getAll();
      
      // Éxito: guardamos los datos
      setState({ profesionales: data, loading: false, error: null });
    } catch (err) {
      // Error: guardamos el error
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err as ApiError,
      }));
    }
  }, []);

  // ============================================================
  // FUNCIÓN PARA CREAR
  // ============================================================
  const createProfesional = useCallback(async (data: CreateProfesionalDto): Promise<Profesional> => {
    const nuevo = await profesionalService.create(data);
    // Después de crear, recargamos la lista
    await fetchProfesionales();
    return nuevo;
  }, [fetchProfesionales]);

  // ============================================================
  // FUNCIÓN PARA ELIMINAR
  // ============================================================
  const deleteProfesional = useCallback(async (id: number): Promise<void> => {
    await profesionalService.delete(id);
    // Después de eliminar, recargamos la lista
    await fetchProfesionales();
  }, [fetchProfesionales]);

  // ============================================================
  // EFECTO: CARGAR AL MONTAR
  // ============================================================
  // useEffect: ejecuta código cuando el componente se monta o cambia algo
  useEffect(() => {
    fetchProfesionales();
  }, [fetchProfesionales]);

  // ============================================================
  // RETORNO
  // ============================================================
  return {
    ...state,
    refetch: fetchProfesionales,
    createProfesional,
    deleteProfesional,
  };
}
