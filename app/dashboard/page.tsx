/**
 * ============================================================
 * PÁGINA - DASHBOARD HOME
 * ============================================================
 * Página principal del dashboard con métricas y resumen.
 */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Título de la página */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bienvenido al Dashboard</h2>
        <p className="text-gray-600">Resumen de tu negocio</p>
      </div>

      {/* Cards de métricas - Ejemplo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Reservas Hoy</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          <p className="text-sm text-green-600 mt-2">+8% vs ayer</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Profesionales Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Servicios</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Ingresos del Mes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">S/ 4,500</p>
        </div>
      </div>

      {/* Aquí irán más secciones: gráficos, últimas reservas, etc. */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Próximas Reservas
        </h3>
        <p className="text-gray-500">
          Aquí mostrarás las próximas citas del día...
        </p>
      </div>
    </div>
  );
}
