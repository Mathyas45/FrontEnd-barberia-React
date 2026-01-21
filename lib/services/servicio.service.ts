/**
 * ============================================================
 * SERVICIO - SERVICIOS (de barbería)
 * ============================================================
 * Operaciones para los servicios que ofrece el negocio.
 * 
 * EJEMPLO de cómo crear tu siguiente servicio siguiendo este patrón.
 */

import { httpClient } from './http-client';
import type {
  Servicio,
  CreateServicioDto,
  UpdateServicioDto,
  ApiPaginatedResponse,
  PaginationParams,
} from '@/lib/types';

const ENDPOINT = '/servicios';

export const servicioService = {
  /**
   * Obtiene lista paginada de servicios
   */
  async getAll(params?: PaginationParams): Promise<ApiPaginatedResponse<Servicio>> {
    const response = await httpClient.get<ApiPaginatedResponse<Servicio>>(ENDPOINT, {
      params,
    });
    return response.data;
  },

  /**
   * Obtiene todos los servicios activos (sin paginación)
   */
  async getAllActive(): Promise<Servicio[]> {
    const response = await httpClient.get<Servicio[]>(`${ENDPOINT}/activos`);
    return response.data;
  },

  /**
   * Obtiene un servicio por ID
   */
  async getById(id: number): Promise<Servicio> {
    const response = await httpClient.get<Servicio>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo servicio
   */
  async create(data: CreateServicioDto): Promise<Servicio> {
    const response = await httpClient.post<Servicio>(ENDPOINT, data);
    return response.data;
  },

  /**
   * Actualiza un servicio existente
   */
  async update(id: number, data: UpdateServicioDto): Promise<Servicio> {
    const response = await httpClient.put<Servicio>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un servicio
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINT}/${id}`);
  },
};
