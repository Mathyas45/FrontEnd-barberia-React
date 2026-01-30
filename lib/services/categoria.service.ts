
import { httpClient } from './http-client';
import type { 
    Categoria,
    CategoriaRequest,
    CategoriaResponse,
    ApiResponse,
} from '@/lib/types';

const ENDPOINT = '/categorias';


export const categoriaService = {
    async getAll(query?: string): Promise<Categoria[]> {
        const params = query ? { query } : {};
        const response = await httpClient.get<ApiResponse<Categoria[]>>(ENDPOINT, { params });
        return response.data.data || [];
    },

    async getById(id: number): Promise<Categoria> {
        const response = await httpClient.get<ApiResponse<Categoria>>(`${ENDPOINT}/${id}`);
        return response.data.data;
    },
    async create(data: CategoriaRequest): Promise<Categoria> {
        const response = await httpClient.post<ApiResponse<Categoria>>(`${ENDPOINT}/register`, data);
        return response.data.data;
    },
    async update(id: number, data: CategoriaRequest): Promise<Categoria> {
        const response = await httpClient.put<ApiResponse<Categoria>>(`${ENDPOINT}/update/${id}`, data);
        return response.data.data;
    },
    async delete(id: number): Promise<void> {
        await httpClient.put(`${ENDPOINT}/eliminar/${id}`);
    },

};