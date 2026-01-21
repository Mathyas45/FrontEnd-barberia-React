/**
 * ============================================================
 * SERVICIO - PROFESIONALES
 * ============================================================
 * Todas las operaciones relacionadas con profesionales/barberos.
 * 
 * ENDPOINTS según CONTEXTO_PARA_FRONTEND.md:
 * GET    /profesionales              - Listar todos
 * GET    /profesionales/{id}         - Obtener por ID
 * POST   /profesionales              - Crear
 * PUT    /profesionales/{id}         - Actualizar
 * DELETE /profesionales/{id}         - Eliminar (soft delete)
 * GET    /profesionales/{id}/horarios - Horarios del profesional
 * POST   /profesionales/{id}/horarios - Agregar horario
 * GET    /profesionales/{id}/servicios - Servicios que ofrece
 */

import { httpClient } from './http-client';
import type {
  Profesional,
  CreateProfesionalDto,
  UpdateProfesionalDto,
  HorarioProfesional,
  HorarioDto,
  ApiResponse,
} from '@/lib/types';

// Endpoint base
const ENDPOINT = '/profesionales';

/**
 * Servicio de Profesionales
 */
export const profesionalService = {
  /**
   * Obtiene lista de todos los profesionales del negocio
   * El backend filtra automáticamente por negocioId del token
   * Respuesta viene en formato: { code, success, message, data: [...] }
   */
  async getAll(): Promise<Profesional[]> {
    const response = await httpClient.get<ApiResponse<Profesional[]>>(ENDPOINT);
    return response.data.data || [];
  },

  /**
   * Obtiene un profesional por ID
   */
  async getById(id: number): Promise<Profesional> {
    const response = await httpClient.get<ApiResponse<Profesional>>(`${ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Crea un nuevo profesional
   */
  async create(data: CreateProfesionalDto): Promise<Profesional> {
    const response = await httpClient.post<ApiResponse<Profesional>>(ENDPOINT, data);
    return response.data.data;
  },

  /**
   * Actualiza un profesional existente
   */
  async update(id: number, data: UpdateProfesionalDto): Promise<Profesional> {
    const response = await httpClient.put<ApiResponse<Profesional>>(`${ENDPOINT}/${id}`, data);
    return response.data.data;
  },

  /**
   * Elimina (soft delete) un profesional
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`${ENDPOINT}/${id}`);
  },

  // ============================================================
  // HORARIOS
  // ============================================================

  /**
   * Obtiene los horarios de un profesional
   */
  async getHorarios(profesionalId: number): Promise<HorarioProfesional[]> {
    const response = await httpClient.get<ApiResponse<HorarioProfesional[]>>(
      `${ENDPOINT}/${profesionalId}/horarios`
    );
    return response.data.data || [];
  },

  /**
   * Agrega un horario a un profesional
   */
  async addHorario(profesionalId: number, data: HorarioDto): Promise<HorarioProfesional> {
    const response = await httpClient.post<ApiResponse<HorarioProfesional>>(
      `${ENDPOINT}/${profesionalId}/horarios`,
      data
    );
    return response.data.data;
  },

  // ============================================================
  // SERVICIOS QUE OFRECE
  // ============================================================

  /**
   * Obtiene los servicios que ofrece un profesional
   */
  async getServicios(profesionalId: number): Promise<unknown[]> {
    const response = await httpClient.get<ApiResponse<unknown[]>>(`${ENDPOINT}/${profesionalId}/servicios`);
    return response.data.data || [];
  },

  /**
   * Asigna un servicio a un profesional
   */
  async addServicio(profesionalId: number, servicioId: number): Promise<void> {
    await httpClient.post(`${ENDPOINT}/${profesionalId}/servicios`, { servicioId });
  },
};
