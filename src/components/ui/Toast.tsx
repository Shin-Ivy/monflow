'use client';

import React from 'react';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const store = useToastStore() as any;
  const toasts = store.toasts || (store.message ? [{ id: 'default', message: store.message, type: store.type }] : []);
  const removeToast = store.removeToast || store.hideToast || (() => {});

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t: any) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id || t.message}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white transition-all animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#00838F] shrink-0" />}
              <p className="text-xs font-semibold leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};