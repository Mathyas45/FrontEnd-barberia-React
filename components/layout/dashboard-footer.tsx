'use client';

/**
 * ============================================================
 * FOOTER COMPARTIDO
 * ============================================================
 * Footer que aparece en todas las páginas del dashboard.
 * Muestra el copyright y el año actual.
 */

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <span>coax.Inc</span>
        <span className="hidden sm:inline">•</span>
        <span>Sistema de Reservas</span>
        <span className="text-red-500">❤️</span>
        <span>{currentYear}</span>
      </div>
    </footer>
  );
}
