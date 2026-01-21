/**
 * ============================================================
 * PÁGINA - SERVICIOS (Pública)
 * ============================================================
 * 
 * Lista de servicios que ofrece la barbería.
 * Accesible sin login.
 * 
 * TODO: Cargar servicios desde la API (cuando tengas el servicio creado)
 */

import Link from 'next/link';
import { Clock, DollarSign } from 'lucide-react';

// Servicios de ejemplo (después los cargarás del API)
const serviciosEjemplo = [
  {
    id: 1,
    nombre: 'Corte Clásico',
    descripcion: 'Corte tradicional con máquina y tijeras',
    duracion: 30,
    precio: 15.00,
    categoria: 'Corte de Cabello',
  },
  {
    id: 2,
    nombre: 'Corte Moderno',
    descripcion: 'Corte actual con diseño personalizado',
    duracion: 45,
    precio: 25.00,
    categoria: 'Corte de Cabello',
  },
  {
    id: 3,
    nombre: 'Barba',
    descripcion: 'Perfilado y arreglo de barba profesional',
    duracion: 20,
    precio: 10.00,
    categoria: 'Barba',
  },
  {
    id: 4,
    nombre: 'Corte + Barba',
    descripcion: 'Combo completo de corte de cabello y arreglo de barba',
    duracion: 50,
    precio: 30.00,
    categoria: 'Combos',
  },
];

export default function ServiciosPublicPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Ofrecemos una variedad de servicios de barbería con los mejores profesionales
          </p>
        </div>
      </section>

      {/* Lista de servicios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosEjemplo.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {servicio.categoria}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mt-3">
                  {servicio.nombre}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {servicio.descripcion}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{servicio.duracion} min</span>
                  </div>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <DollarSign className="w-4 h-4" />
                    <span>{servicio.precio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/reservar"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reservar Cita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
