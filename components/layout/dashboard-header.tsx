'use client';

/**
 * ============================================================
 * HEADER GLOBAL DEL DASHBOARD
 * ============================================================
 * 
 * Barra superior que aparece en todas las páginas del sistema.
 * Incluye:
 * - Toggle de modo oscuro/claro
 * - Accesos directos (notificaciones, búsqueda)
 * - Menú de perfil del usuario
 * 
 * DARK MODE:
 * Usa next-themes con useTheme() hook para cambiar entre temas.
 * Los estilos dark:* de Tailwind se aplican automáticamente.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { authService } from '@/lib/services';
import { useTheme } from '@/lib/context/theme-context';
import type { Usuario } from '@/lib/types';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function DashboardHeader() {
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<Usuario | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cargar usuario
  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        {/* ========== LADO IZQUIERDO ========== */}
        <div className="flex items-center gap-4">
          {/* Título o breadcrumb (opcional) */}
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden md:block">
            Sistema de Gestión
          </h1>
        </div>

        {/* ========== LADO DERECHO - Acciones ========== */}
        <div className="flex items-center gap-2">
          {/* Búsqueda rápida */}
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Buscar"
          >
            <Search size={20} />
          </button>

          {/* Notificaciones */}
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            title="Notificaciones"
          >
            <Bell size={20} />
            {/* Badge de notificaciones */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Separador */}
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

          {/* Menú de Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.nombreCompleto?.charAt(0) || 'U'}
                </span>
              </div>
              
              {/* Nombre (oculto en móvil) */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.nombreCompleto || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.rol?.nombre || 'Rol'}
                </p>
              </div>
              
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {/* Info del usuario */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.nombreCompleto}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {user?.negocio?.nombre}
                  </p>
                </div>

                {/* Links */}
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={16} />
                  Mi Perfil
                </Link>

                <Link
                  href="/dashboard/configuracion"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={16} />
                  Configuración
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
