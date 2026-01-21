/**
 * ============================================================
 * COMPONENTE - SIDEBAR
 * ============================================================
 * Menú lateral desplegable para el dashboard.
 * 
 * 📍 AQUÍ AGREGAS NUEVAS SECCIONES AL MENÚ
 * 
 * Busca el array "menuItems" abajo y agrega tu nueva sección.
 * Luego crea la página correspondiente en app/dashboard/[tu-seccion]/page.tsx
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Scissors,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  FolderOpen,
} from 'lucide-react';

/**
 * ============================================================
 * 📍 ITEMS DEL MENÚ - AGREGA NUEVAS SECCIONES AQUÍ
 * ============================================================
 */
const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profesionales',
    href: '/dashboard/profesionales',
    icon: Users,
  },
  {
    title: 'Servicios',
    href: '/dashboard/servicios',
    icon: Scissors,
  },
  {
    title: 'Categorías',
    href: '/dashboard/categorias',
    icon: FolderOpen,
  },
  {
    title: 'Clientes',
    href: '/dashboard/clientes',
    icon: UserCircle,
  },
  {
    title: 'Reservas',
    href: '/dashboard/reservas',
    icon: Calendar,
  },
  {
    title: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  // Estado para expandir/contraer el sidebar
  const [collapsed, setCollapsed] = useState(false);
  
  // Hook de Next.js para saber la ruta actual
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* ========== HEADER DEL SIDEBAR ========== */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <span className="text-xl font-bold">🏪 Barbería</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* ========== NAVEGACIÓN ========== */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            // Determinar si este item está activo
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ========== FOOTER DEL SIDEBAR ========== */}
      <div className="border-t border-gray-800 p-4">
        {!collapsed && (
          <div className="text-xs text-gray-500">
            <p>Sistema de Gestión</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
