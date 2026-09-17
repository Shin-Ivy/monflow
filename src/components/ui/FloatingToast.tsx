// src/components/ui/FloatingToast.tsx
'use client';

import React from 'react';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const FloatingToast = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-[16px] border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              isSuccess
                ? 'bg-[#0B1120]/95 border-[#00838F]/40 text-[#F8FAFC]'
                : isError
                ? 'bg-[#0B1120]/95 border-[#DB2777]/40 text-[#F8FAFC]'
                : 'bg-[#0B1120]/95 border-[#334155] text-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#00838F] shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#DB2777] shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#EB7500] shrink-0" />}
              <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#64748B] hover:text-[#F8FAFC] transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};