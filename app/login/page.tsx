'use client';

/**
 * ============================================================
 * PÁGINA - LOGIN (Moderno y Profesional)
 * ============================================================
 * 
 * Página de inicio de sesión con:
 * - Diseño split (imagen + formulario)
 * - Validación con react-hook-form + zod
 * - Integración con AuthService
 * - Manejo de errores
 * - Estados de carga
 * 
 * ESTRUCTURA:
 * ┌─────────────────────────────────────────────────────────┐
 * │  ┌──────────────────┐  ┌─────────────────────────────┐  │
 * │  │                  │  │     Logo                    │  │
 * │  │   Imagen/Brand   │  │     Título                  │  │
 * │  │                  │  │     Formulario              │  │
 * │  │                  │  │     - Email                 │  │
 * │  │                  │  │     - Password              │  │
 * │  │                  │  │     - Remember me           │  │
 * │  │                  │  │     - Botón Login           │  │
 * │  └──────────────────┘  └─────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────┘
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Scissors, AlertCircle } from 'lucide-react';
import { authService } from '@/lib/services';
import { parseApiError } from '@/lib/utils';
import type { ApiError } from '@/lib/types';

// ============================================================
// ESQUEMA DE VALIDACIÓN CON ZOD, zod es una biblioteca para validación y parsing de datos
// ============================================================
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .trim()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL a la que redirigir después del login (si viene del middleware)
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  // Estados locales
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Configurar react-hook-form con zod, esto nos sirve para manejar formularios y validación
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // ============================================================
  // HANDLER: Enviar formulario
  // ============================================================
  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setFieldErrors({});

    try {
      // Llamar al servicio de autenticación
      await authService.login({
        email: data.email,
        password: data.password,
      });

      // Redirigir al dashboard o a la URL original
      router.push(redirectTo);
    } catch (error) {
      // Parsear el error del backend
      const apiError = error as ApiError;
      const parsed = parseApiError(apiError);
      
      // Si hay errores de campo, mostrarlos
      if (Object.keys(parsed.fields).length > 0) {
        setFieldErrors(parsed.fields);
      }
      
      // Mostrar error general
      setServerError(
        parsed.general || 'Error al iniciar sesión. Intenta nuevamente.'
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen flex">
      {/* ========== PANEL IZQUIERDO - Branding ========== */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Contenido del panel de branding */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          {/* 
            ============================================================
            AQUÍ VA TU LOGO/IMAGEN
            ============================================================
            Reemplaza este div con tu imagen:
            <Image src="/images/logo-white.png" alt="Logo" width={200} height={200} />
          */}
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/30">
            <Scissors className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4 text-center">
            Sistema de Gestión
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-md">
            Administra tu barbería de forma profesional: clientes, citas, 
            profesionales y más.
          </p>

          {/* Features destacados */}
          <div className="mt-12 space-y-4">
            <FeatureItem text="Gestión de reservas en tiempo real" />
            <FeatureItem text="Control de profesionales y horarios" />
            <FeatureItem text="Reportes y estadísticas" />
          </div>
        </div>
      </div>

      {/* ========== PANEL DERECHO - Formulario ========== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo para móvil (se muestra solo en pantallas pequeñas) */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Encabezado del formulario */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido
            </h2>
            <p className="text-gray-600 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Error del servidor */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error de autenticación</p>
                <p className="text-red-600 text-sm">{serverError}</p>
                {/* Mostrar errores de campo si existen */}
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {Object.entries(fieldErrors).map(([field, message]) => (
                      <li key={field} className="text-red-600 text-sm">
                        <span className="font-medium capitalize">{field}:</span> {message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo: Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="tu@email.com"
                autoComplete="email"
                className={`w-full px-4 py-3 border rounded-lg transition-colors outline-none text-gray-900
                  ${errors.email 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Campo: Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors outline-none text-gray-900
                    ${errors.password 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Datos de prueba (solo para desarrollo) */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              🔑 Credenciales de prueba:
            </p>
            <code className="text-xs text-blue-700 block">
              Email: admin@barberia.com<br />
              Password: admin123
            </code>
          </div>

          {/* Link a registro */}
          <p className="mt-8 text-center text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>

          {/* Volver al inicio */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE AUXILIAR: Feature Item
// ============================================================
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-blue-300 rounded-full" />
      <span className="text-blue-100">{text}</span>
    </div>
  );
}
