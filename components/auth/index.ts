/**
 * Componentes de Autenticación y Autorización
 * 
 * Exporta:
 * - PermissionGate: Muestra contenido solo si tiene permisos
 * - RoleGate: Muestra contenido solo si tiene cierto rol
 * - AdminOnly: Shortcut para contenido solo de admin
 * - ProtectedRoute: Protege rutas completas
 */

export {
  PermissionGate,
  RoleGate,
  AdminOnly,
  ProtectedRoute,
} from './permission-gate';
