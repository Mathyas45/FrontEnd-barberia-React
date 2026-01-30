
import { httpClient } from './http-client';
import type { 
    Cliente,
    ClienteRequest,
    ClienteResponse,
    ApiResponse,
} from '@/lib/types';

const ENDPOINT = '/clientes';

export const clienteService = {
    /**
     * Obtiene todos los clientes del negocio actual.
     * El backend filtra automáticamente por negocioId del token (multitenancy).
     */
    async getAll(query?: string): Promise<Cliente[]> {
        const params = query ? { query } : {};
        const response = await httpClient.get<ApiResponse<Cliente[]>>(ENDPOINT, { params });
        return response.data.data || [];
    },

    async getById(id: number): Promise<Cliente> {
        const response = await httpClient.get<ApiResponse<Cliente>>(`${ENDPOINT}/${id}`);
        return response.data.data;
    },

    async create(data: ClienteRequest): Promise<Cliente> {
        const response = await httpClient.post<ApiResponse<Cliente>>(`${ENDPOINT}/register`, data);
        return response.data.data;
    },

    async update(id: number, data: ClienteRequest): Promise<Cliente> {
        const response = await httpClient.put<ApiResponse<Cliente>>(`${ENDPOINT}/update/${id}`, data);
        return response.data.data;
    },
    
    async delete(id: number): Promise<void> {
        await httpClient.put(`${ENDPOINT}/eliminar/${id}`);
    },

};        