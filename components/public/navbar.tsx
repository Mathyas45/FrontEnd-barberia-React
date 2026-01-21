/**
 * ============================================================
 * NAVBAR PÚBLICA
 * ============================================================
 * 
 * Barra de navegación para la página web pública de la barbería.
 * Es diferente al sidebar del dashboard.
 * 
 * SECCIONES TÍPICAS:
 * - Inicio
 * - Servicios
 * - Nosotros
 * - Reservar (CTA principal)
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scissors } from 'lucide-react';

// Items de navegación pública
const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Contacto', href: '/#contacto' },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Barbería</span>
            </Link>
          </div>

          {/* Nav items desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Botón CTA */}
            <Link
              href="/reservar"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Reservar Cita
            </Link>
          </div>

          {/* Botón menú móvil */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/reservar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center mt-2"
            >
              Reservar Cita
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;
