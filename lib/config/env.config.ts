/**
 * ============================================================
 * CONFIGURACIÓN DE ENTORNO
 * ============================================================
 * Centraliza todas las variables de entorno del proyecto.
 * NUNCA hardcodees URLs o configuraciones directamente en el código.
 * 
 * Para configurar: crea un archivo .env.local en la raíz con:
 * NEXT_PUBLIC_API_URL=http://localhost:8080
 * NEXT_PUBLIC_APP_NAME=Barbería
 */

export const envConfig = {
  // URL base del API backend
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // Nombre de la aplicación
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Barbería',
  
  // Ambiente actual
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'barberia_token',
    userKey: 'barberia_user',
  },
} as const;

// Tipo para autocompletado
export type EnvConfig = typeof envConfig;
