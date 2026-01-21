/**
 * ============================================================
 * LAYOUT - GRUPO (WEB)
 * ============================================================
 * 
 * Este layout aplica a todas las páginas dentro de (web).
 * 
 * IMPORTANTE: El nombre entre paréntesis (web) es un "route group".
 * - NO aparece en la URL
 * - Permite organizar archivos sin afectar las rutas
 * 
 * ESTRUCTURA:
 * - /app/(web)/page.tsx → URL: /
 * - /app/(web)/servicios/page.tsx → URL: /servicios
 * - /app/(web)/nosotros/page.tsx → URL: /nosotros
 */

import { PublicNavbar, PublicFooter } from '@/components/public';

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar fija */}
      <PublicNavbar />

      {/* Contenido principal - padding-top para compensar navbar fija */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
