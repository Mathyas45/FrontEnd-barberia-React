/**
 * ============================================================
 * BARREL EXPORT - CONTEXT
 * ============================================================
 * Exporta todos los contextos desde un solo punto.
 * 
 * NOTA: Los toasts ahora usan sonner directamente.
 * Ver: lib/utils/toast.utils.ts
 * Uso: import { showSuccess, showError, showPromise } from '@/lib/utils';
 */

export { AuthProvider, useAuth } from './auth-context';
export { ThemeProvider, useTheme } from './theme-context';

// Toast custom DEPRECADO - Ahora usamos sonner
// export { ToastProvider, useToast } from './toast-context';
