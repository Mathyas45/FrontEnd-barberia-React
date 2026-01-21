/**
 * ============================================================
 * LAYOUT - DASHBOARD
 * ============================================================
 * Layout principal para todas las páginas del sistema admin.
 * 
 * ESTRUCTURA:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Sidebar │           Header (sticky)                      │
 * │         │────────────────────────────────────────────────│
 * │         │                                                │
 * │         │           Contenido Principal                  │
 * │         │                                                │
 * └─────────────────────────────────────────────────────────┘
 */

import { FlowbiteSidebar, DashboardHeader, DashboardFooter } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar con Flowbite */}
      <FlowbiteSidebar />

      {/* Contenido principal - con margen izquierdo para el sidebar */}
      <div className="sm:ml-64 flex flex-col min-h-screen">
        {/* Header global sticky */}
        <DashboardHeader />

        {/* Área de contenido */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* Footer compartido */}
        <DashboardFooter />
      </div>
    </div>
  );
}

