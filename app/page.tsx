/**
 * ============================================================
 * PÁGINA - LANDING / HOME PÚBLICA
 * ============================================================
 * Página de inicio del sitio web público.
 * 
 * Esta es la página que ve cualquier visitante.
 * Desde aquí pueden ir a hacer una reserva.
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navbar simple */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">Barbería</span>
          <div className="flex items-center gap-4">
            <Link
              href="/reservar"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Reservar
            </Link>
            <Link
              href="/login"
              className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tu Barbería de Confianza
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Reserva tu cita en segundos y disfruta de los mejores cortes 
            con nuestros profesionales expertos.
          </p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Reservar Ahora
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Reserva Online
            </h3>
            <p className="text-gray-400">
              Elige el día, hora y profesional que prefieras
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✂️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Profesionales Expertos
            </h3>
            <p className="text-gray-400">
              Los mejores barberos de la ciudad a tu servicio
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Calidad Garantizada
            </h3>
            <p className="text-gray-400">
              Satisfacción en cada visita
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
