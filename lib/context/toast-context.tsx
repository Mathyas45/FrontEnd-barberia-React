'use client';

/**
 * ============================================================
 * CONTEXTO DE TOAST - Sistema de Notificaciones
 * ============================================================
 * 
 * Permite mostrar notificaciones (toasts) desde cualquier parte de la app.
 * 
 * TIPOS DE TOAST:
 * - success: Acción completada correctamente (verde)
 * - error: Algo salió mal (rojo)
 * - warning: Advertencia (amarillo)
 * - info: Información general (azul)
 * 
 * USO:
 * ```tsx
 * import { useToast } from '@/lib/context';
 * 
 * function MiComponente() {
 *   const { showToast } = useToast();
 *   
 *   const handleSave = async () => {
 *     try {
 *       await guardarDatos();
 *       showToast('Datos guardados correctamente', 'success');
 *     } catch (error) {
 *       showToast('Error al guardar', 'error');
 *     }
 *   };
 * }
 * ```
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

// ============================================================
// CONTEXTO
// ============================================================
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============================================================
// CONFIGURACIÓN DE ESTILOS POR TIPO
// ============================================================
const toastStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; iconColor: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    icon: XCircle,
    iconColor: 'text-red-500 dark:text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
};

// ============================================================
// PROVIDER
// ============================================================
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Mostrar un nuevo toast
  const showToast = useCallback((
    message: string, 
    type: ToastType = 'success', 
    duration: number = 3000 // 3 segundos por defecto
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remover después del tiempo especificado
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  // Ocultar un toast específico
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      
      {/* ========== CONTENEDOR DE TOASTS ========== */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;
          
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto
                flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
                animate-in slide-in-from-right duration-300
                ${style.bg}
              `}
              role="alert"
            >
              {/* Ícono */}
              <Icon className={`flex-shrink-0 ${style.iconColor}`} size={20} />
              
              {/* Mensaje */}
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {toast.message}
              </p>
              
              {/* Botón cerrar */}
              <button
                onClick={() => hideToast(toast.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  
  return context;
}

export default ToastProvider;
