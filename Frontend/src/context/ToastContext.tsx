import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast, ToastItem, ToastType } from '../components/ui/Toast';

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3400) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = { id, message, type, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5));

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-16 right-4 sm:right-8 z-50 flex flex-col gap-2.5 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
