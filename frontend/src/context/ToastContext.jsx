import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/90 backdrop-blur-md border-emerald-200/80',
          text: 'text-emerald-800',
          icon: <CheckCircle className="w-5 h-5 text-emerald-650 shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50/90 backdrop-blur-md border-red-200/80',
          text: 'text-red-800',
          icon: <XCircle className="w-5 h-5 text-red-650 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/90 backdrop-blur-md border-amber-200/80',
          text: 'text-amber-805',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50/90 backdrop-blur-md border-blue-200/80',
          text: 'text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-9999 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-350 transform animate-in slide-in-from-left ${styles.bg}`}
              role="alert"
            >
              <div className="flex gap-3">
                {styles.icon}
                <p className={`text-xs font-bold leading-relaxed ${styles.text}`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer shrink-0 ${styles.text}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
