/**
 * ============================================================
 * SERVICIO - RESERVAS
 * ============================================================
 * Operaciones para gestión de citas/reservas.
 */

import { httpClient } from './http-client';
import type {
  Reserva,
  CreateReservaDto,
  UpdateReservaDto,
  ReservaFilters,
  ApiPaginatedResponse,
  PaginationParams,
} from '@/lib/types';

const ENDPOINT = '/reservas';

export const reservaService = {
  /**
   * Obtiene lista paginada de reservas con filtros opcionales
   */
  async getAll(
    params?: PaginationParams & ReservaFilters
  ): Promise<ApiPaginatedResponse<Reserva>> {
    const response = await httpClient.get<ApiPaginatedResponse<Reserva>>(ENDPOINT, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene reservas de un día específico
   */
  async getByDate(fecha: string): Promise<Reserva[]> {
    const response = await httpClient.get<Reserva[]>(`${ENDPOINT}/fecha/${fecha}`);
    return response.data;
  },

  /**
   * Obtiene una reserva por ID
   */
  async getById(id: number): Promise<Reserva> {
    const response = await httpClient.get<Reserva>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva reserva (usado desde web pública)
   * NO requiere autenticación
   */
  async create(data: CreateReservaDto): Promise<Reserva> {
    const response = await httpClient.post<Reserva>(ENDPOINT, data);
    return response.data;
  },

  /**
   * Actualiza una reserva
   */
  async update(id: number, data: UpdateReservaDto): Promise<Reserva> {
    const response = await httpClient.put<Reserva>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Cambia el estado de una reserva
   */
  async cambiarEstado(id: number, estado: string): Promise<Reserva> {
    const response = await httpClient.patch<Reserva>(`${ENDPOINT}/${id}/estado`, {
      estado,
    });
    return response.data;
  },

  /**
   * Cancela una reserva
   */
  async cancelar(id: number): Promise<Reserva> {
    return this.cambiarEstado(id, 'CANCELADA');
  },

  /**
   * Confirma una reserva
   */
  async confirmar(id: number): Promise<Reserva> {
    return this.cambiarEstado(id, 'CONFIRMADA');
  },
};
