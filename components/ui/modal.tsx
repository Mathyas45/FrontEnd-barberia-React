'use client';

/**
 * ============================================================
 * COMPONENTE - MODAL REUTILIZABLE
 * ============================================================
 * 
 * Modal genérico que se puede usar para:
 * - Crear registros
 * - Editar registros
 * - Confirmar eliminación
 * - Mostrar información
 * 
 * PROPS:
 * - isOpen: controla si el modal está visible
 * - onClose: función para cerrar el modal
 * - title: título del modal
 * - children: contenido del modal
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

  // Cerrar al hacer clic en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl',
          'transform transition-all duration-200',
          'animate-in fade-in-0 zoom-in-95',
          sizeClasses[size]
        )}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 
            id="modal-title" 
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Contenido del Modal */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL DE CONFIRMACIÓN (Para eliminar)
// ============================================================
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: '🗑️',
    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
  },
  warning: {
    icon: '⚠️',
    confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300',
  },
  info: {
    icon: 'ℹ️',
    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        {/* Icono */}
        <div className="text-5xl mb-4">{styles.icon}</div>

        {/* Mensaje */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>

        {/* Botones */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:ring-4 disabled:opacity-50',
              styles.confirmBtn
            )}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
