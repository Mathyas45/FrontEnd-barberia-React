'use client';

/**
 * ============================================================
 * SIDEBAR CON FLOWBITE
 * ============================================================
 * 
 * Menú lateral del dashboard basado en Flowbite.
 * Es responsivo: se oculta en móvil y se muestra con un botón.
 * 
 * CÓMO AGREGAR NUEVOS ITEMS:
 * 1. Busca el array menuItems abajo
 * 2. Agrega un objeto con: label, href, icon
 * 3. El icono lo tomas de Heroicons o Lucide
 * 
 * ESTRUCTURA:
 * - Logo del negocio arriba
 * - Items de navegación
 * - Usuario y cerrar sesión abajo
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Scissors,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle
} from 'lucide-react';

// ============================================================
// ITEMS DEL MENÚ - EDITA AQUÍ PARA AGREGAR SECCIONES
// ============================================================
const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Profesionales',
    href: '/dashboard/profesionales',
    icon: Users,
  },
  {
    label: 'Servicios',
    href: '/dashboard/servicios',
    icon: Scissors,
  },
  {
    label: 'Reservas',
    href: '/dashboard/reservas',
    icon: Calendar,
  },
  {
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
];

// ============================================================
// COMPONENTE SIDEBAR
// ============================================================
export function FlowbiteSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Necesario para evitar hydration mismatch con flowbite
  useEffect(() => {
    setMounted(true);
    // Inicializar Flowbite después del montaje
    const initFlowbite = async () => {
      const { initFlowbite } = await import('flowbite');
      initFlowbite();
    };
    initFlowbite();
  }, []);

  // Verificar si una ruta está activa
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Cerrar sidebar al navegar (en móvil)
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  if (!mounted) {
    return null; // Evitar hydration mismatch
  }

  return (
    <>
      {/* ============================================================
          BOTÓN TOGGLE MÓVIL
          ============================================================ */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="logo-sidebar"
        aria-expanded={sidebarOpen}
      >
        <span className="sr-only">Abrir menú</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* ============================================================
          OVERLAY (Fondo oscuro en móvil cuando sidebar está abierto)
          ============================================================ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================================
          SIDEBAR
          ============================================================ */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* ========== LOGO Y NOMBRE ========== */}
          <Link href="/dashboard" className="flex items-center ps-2.5 mb-5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              Barbería
            </span>
          </Link>

          {/* ========== ITEMS DE NAVEGACIÓN ========== */}
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center p-2 rounded-lg group transition-colors ${
                      active
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                      }`}
                    />
                    <span className="ms-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ========== SEPARADOR ========== */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

          {/* ========== SECCIÓN INFERIOR (Usuario) ========== */}
          <ul className="space-y-2 font-medium">
            <li>
              <div className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-lg">
                <UserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="ms-3 text-sm">Admin</span>
              </div>
            </li>
            <li>
              <button
                onClick={() => {
                  // Usar authService para logout
                  import('@/lib/services').then(({ authService }) => {
                    authService.logout();
                  });
                }}
                className="flex items-center w-full p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 group transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-700 dark:group-hover:text-red-400" />
                <span className="ms-3">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default FlowbiteSidebar;
