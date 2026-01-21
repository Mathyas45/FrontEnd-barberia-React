/**
 * ============================================================
 * PÁGINA - PROFESIONALES (Lista + CRUD)
 * ============================================================
 * 
 * ESTA ES TU GUÍA PRINCIPAL. Estudia este archivo para entender:
 * 1. Cómo usar hooks para cargar datos
 * 2. Cómo manejar estados (loading, error, success)
 * 3. Cómo mostrar datos en una tabla
 * 4. Cómo implementar acciones (crear, eliminar)
 * 
 * FLUJO DE DATOS:
 * Página → Hook → Servicio → HTTP Client → Backend API
 */

'use client';

import { useState } from 'react';
import { useProfesionales } from '@/lib/hooks';
import type { CreateProfesionalDto } from '@/lib/types';
import { Users, Plus, Trash2, RefreshCw, X } from 'lucide-react';

export default function ProfesionalesPage() {
  // ============================================================
  // HOOK: Carga y maneja los profesionales
  // ============================================================
  const { 
    profesionales,    // Array de profesionales
    loading,          // true mientras carga
    error,            // Error si falla
    refetch,          // Función para recargar
    createProfesional,// Función para crear
    deleteProfesional // Función para eliminar
  } = useProfesionales();

  // ============================================================
  // ESTADO LOCAL: Para el modal de crear
  // ============================================================
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ============================================================
  // HANDLER: Crear nuevo profesional
  // ============================================================
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    // Obtener datos del formulario
    const formData = new FormData(e.currentTarget);
    const data: CreateProfesionalDto = {
      nombreCompleto: formData.get('nombreCompleto') as string,
      documentoIdentidad: formData.get('documentoIdentidad') as string,
      telefono: formData.get('telefono') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      usaHorarioNegocio: true,
    };

    try {
      await createProfesional(data);
      setShowModal(false);
      // El hook ya recarga la lista automáticamente
    } catch (err) {
      setFormError((err as Error).message || 'Error al crear profesional');
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // HANDLER: Eliminar profesional
  // ============================================================
  const handleDelete = async (id: number, nombre: string) => {
    // Confirmar antes de eliminar
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      return;
    }

    try {
      await deleteProfesional(id);
      // El hook ya recarga la lista automáticamente
    } catch (err) {
      alert('Error al eliminar: ' + (err as Error).message);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profesionales</h2>
          <p className="text-gray-600">Gestiona los barberos de tu negocio</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón Recargar */}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            title="Recargar lista"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Botón Crear */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Profesional
          </button>
        </div>
      </div>

      {/* ========== ESTADO: CARGANDO ========== */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando profesionales...</p>
        </div>
      )}

      {/* ========== ESTADO: ERROR ========== */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error al cargar datos</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-red-600 underline hover:text-red-800"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ========== ESTADO: SIN DATOS ========== */}
      {!loading && !error && profesionales.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay profesionales
          </h3>
          <p className="mt-2 text-gray-600">
            Empieza agregando tu primer profesional
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Agregar Profesional
          </button>
        </div>
      )}

      {/* ========== ESTADO: CON DATOS - TABLA ========== */}
      {!loading && !error && profesionales.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profesionales.map((profesional) => (
                <tr key={profesional.id} className="hover:bg-gray-50">
                  {/* Nombre con Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-lg">
                          {profesional.nombreCompleto.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {profesional.nombreCompleto}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Documento */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profesional.documentoIdentidad}
                  </td>
                  
                  {/* Teléfono */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profesional.telefono || '-'}
                  </td>
                  
                  {/* Dirección */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profesional.direccion || '-'}
                  </td>
                  
                  {/* Tipo de horario */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      profesional.usaHorarioNegocio
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profesional.usaHorarioNegocio ? 'Negocio' : 'Personalizado'}
                    </span>
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(profesional.id, profesional.nombreCompleto)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== MODAL: CREAR PROFESIONAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Nuevo Profesional
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {/* Error del formulario */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {formError}
                </div>
              )}

              {/* Campo: Nombre Completo */}
              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Carlos López"
                />
              </div>

              {/* Campo: Documento */}
              <div>
                <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Identidad *
                </label>
                <input
                  type="text"
                  id="documentoIdentidad"
                  name="documentoIdentidad"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="12345678"
                />
              </div>

              {/* Campo: Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="987654321"
                />
              </div>

              {/* Campo: Dirección */}
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Av. Principal 123"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
