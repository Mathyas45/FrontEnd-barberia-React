/**
 * ============================================================
 * PÁGINA - RESERVAR (Pública)
 * ============================================================
 * Página de reservas para clientes (sin login).
 * 
 * FLUJO:
 * 1. Cliente selecciona servicio
 * 2. Cliente selecciona profesional
 * 3. Cliente selecciona fecha y hora
 * 4. Cliente ingresa sus datos
 * 5. Se crea la reserva
 * 
 * TODO: Implementar el formulario completo con react-hook-form + zod
 */

'use client';

import { useState } from 'react';
import { useServicios, useProfesionales } from '@/lib/hooks';
import { formatPrecio, formatDuracion } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

// Pasos del formulario
type Step = 'servicio' | 'profesional' | 'horario' | 'datos' | 'confirmacion';

export default function ReservarPage() {
  const [currentStep, setCurrentStep] = useState<Step>('servicio');
  const [selectedServicio, setSelectedServicio] = useState<number | null>(null);
  const [selectedProfesional, setSelectedProfesional] = useState<number | null>(null);

  // Datos de la API
  const { servicios, loading: loadingServicios } = useServicios();
  const { profesionales, loading: loadingProfesionales } = useProfesionales();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Reservar Cita
            </h1>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { key: 'servicio', label: '1. Servicio' },
              { key: 'profesional', label: '2. Profesional' },
              { key: 'horario', label: '3. Horario' },
              { key: 'datos', label: '4. Datos' },
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white'
                      : index < ['servicio', 'profesional', 'horario', 'datos'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < ['servicio', 'profesional', 'horario', 'datos'].indexOf(currentStep) ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
                  {step.label.split('. ')[1]}
                </span>
                {index < 3 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {/* PASO 1: Seleccionar Servicio */}
        {currentStep === 'servicio' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Qué servicio necesitas?
            </h2>

            {loadingServicios ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : (
              <div className="grid gap-4">
                {servicios.map((servicio) => (
                  <button
                    key={servicio.id}
                    onClick={() => {
                      setSelectedServicio(servicio.id);
                      setCurrentStep('profesional');
                    }}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      selectedServicio === servicio.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">
                        {servicio.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDuracion(servicio.duracionMinutos)}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrecio(servicio.precio)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 2: Seleccionar Profesional */}
        {currentStep === 'profesional' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Con quién te gustaría atenderte?
            </h2>

            <button
              onClick={() => setCurrentStep('servicio')}
              className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Volver
            </button>

            {loadingProfesionales ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {profesionales.map((profesional) => (
                  <button
                    key={profesional.id}
                    onClick={() => {
                      setSelectedProfesional(profesional.id);
                      setCurrentStep('horario');
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      selectedProfesional === profesional.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-semibold">
                      {profesional.nombreCompleto.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">
                        {profesional.nombreCompleto}
                      </h3>
                      {profesional.telefono && (
                        <p className="text-sm text-gray-500">
                          Tel: {profesional.telefono}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Seleccionar Horario */}
        {currentStep === 'horario' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Cuándo te gustaría venir?
            </h2>

            <button
              onClick={() => setCurrentStep('profesional')}
              className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Volver
            </button>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center py-8">
                TODO: Implementar selector de fecha y hora disponible
                <br />
                <span className="text-sm">
                  (Calendario + horarios disponibles del profesional)
                </span>
              </p>
              
              {/* Botón temporal para continuar */}
              <button
                onClick={() => setCurrentStep('datos')}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continuar (demo)
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Datos del Cliente */}
        {currentStep === 'datos' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tus datos de contacto
            </h2>

            <button
              onClick={() => setCurrentStep('horario')}
              className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Volver
            </button>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center py-8">
                TODO: Implementar formulario con react-hook-form + zod
                <br />
                <span className="text-sm">
                  (Nombre, Teléfono, Email, Notas)
                </span>
              </p>

              {/* Botón temporal */}
              <button
                onClick={() => setCurrentStep('confirmacion')}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Confirmar Reserva (demo)
              </button>
            </div>
          </div>
        )}

        {/* PASO 5: Confirmación */}
        {currentStep === 'confirmacion' && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-gray-600 mb-8">
              Hemos enviado los detalles de tu cita a tu email.
              Te esperamos!
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Volver al Inicio
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
