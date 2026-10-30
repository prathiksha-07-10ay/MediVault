import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  darkMode: boolean;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss, darkMode }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: 'border-emerald-500/40',
          warning: 'border-amber-500/40',
          error: 'border-rose-500/40',
          info: 'border-cyan-500/40',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${borders[toast.type]} ${
              darkMode ? 'bg-slate-900/90 text-slate-100' : 'bg-white/95 text-slate-900 shadow-slate-300/50'
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-wide">{toast.title}</p>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
