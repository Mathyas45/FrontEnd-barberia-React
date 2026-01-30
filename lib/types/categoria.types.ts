import type { AuditFields, RegEstado } from './common.types';

export interface Categoria extends AuditFields {
  id: number;
  nombre: string;
  descripcion?: string;
  estado : boolean;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
  estado : boolean;
}

export interface CategoriaResponse{
    id: number;
    nombre: string;
    descripcion?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    negocioId: number;
    regEstado: RegEstado;
    estado : boolean;
}