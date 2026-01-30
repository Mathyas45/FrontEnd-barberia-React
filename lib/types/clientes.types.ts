import type { AuditFields, RegEstado } from './common.types';

export interface Cliente extends AuditFields {
  id: number;
  nombreCompleto: string;
  documentoIdentidad: string;
  telefono?: string;
  email?: string;
}

export interface ClienteRequest {
  nombreCompleto: string;
  telefono?: string;
  documentoIdentidad: string;
  fechaNacimiento?: string;
  email?: string;
}

export interface ClienteResponse {
    id: number;
    nombreCompleto: string;
    documentoIdentidad: string;
    telefono?: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    negocioId: number;
    regEstado: RegEstado;
}