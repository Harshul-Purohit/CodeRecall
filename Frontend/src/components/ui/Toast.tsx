import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Toast Component strictly styled in the Slate/Lavender hierarchy:
 * - Primary Surface: #4F3B78
 * - Elevated Borders: #927FBF
 * - High-Contrast Text / Active Highlights / Accents: #C4BBF0
 */
export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, message, type = 'info' } = toast;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#C4BBF0] shrink-0" />;
    }
  };

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 px-4 py-3 bg-[#4F3B78] border-2 border-[#927FBF] text-[#C4BBF0] rounded-xl shadow-2xl text-xs font-mono transition-all duration-200 animate-slide-in min-w-[320px] max-w-md pointer-events-auto"
      style={{
        boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(146, 127, 191, 0.2)'
      }}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {renderIcon()}
        <span className="font-semibold text-[#C4BBF0] break-words line-clamp-2">{message}</span>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-[#C4BBF0]/80 hover:text-white transition-colors p-1 rounded hover:bg-[#363B4E] shrink-0"
        title="Dismiss Notification"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
