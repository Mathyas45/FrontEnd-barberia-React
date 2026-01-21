/**
 * ============================================================
 * FOOTER PÚBLICO
 * ============================================================
 * 
 * Pie de página para la web pública.
 * Incluye información de contacto, redes sociales, etc.
 */

import Link from 'next/link';
import { Scissors, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Barbería</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Tu barbería de confianza. Ofrecemos servicios de corte, barba y 
              tratamientos capilares con los mejores profesionales.
            </p>
            {/* Redes sociales */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/reservar" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Av. Principal 123, Lima</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@barberia.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Barbería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
