/**
 * ============================================================
 * LAYOUT - DASHBOARD
 * ============================================================
 * Layout principal para todas las páginas del sistema admin.
 * Usa el nuevo Sidebar de Flowbite con diseño responsivo.
 * 
 * ESTRUCTURA:
 * - Sidebar fijo a la izquierda (oculto en móvil)
 * - Contenido principal con padding ajustado
 * - El header se incluye en cada página si lo necesitas
 * 
 * En Next.js App Router, los layouts se aplican automáticamente
 * a todas las páginas dentro de su carpeta.
 */

import { FlowbiteSidebar } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar con Flowbite */}
      <FlowbiteSidebar />

      {/* Contenido principal - con margen izquierdo para el sidebar */}
      <div className="p-4 sm:ml-64">
        {/* Área de contenido */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

