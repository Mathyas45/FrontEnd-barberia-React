/**
 * ============================================================
 * COMPONENTE - HEADER DEL DASHBOARD
 * ============================================================
 * Barra superior del dashboard con información del usuario.
 */

'use client';

import { Bell, User } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Título de la página (puedes hacerlo dinámico) */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Acciones de usuario */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          {/* Badge de notificaciones */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Usuario */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </button>
      </div>
    </header>
  );
}
