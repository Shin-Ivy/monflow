import React from 'react';
import { LucideIcon } from 'lucide-react';

// ── APP CARD ───────────────────────────────────────────────────────────────
export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
}

export const AppCard = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[20px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] transition-all shadow-xs ${className}`}
    >
      {children}
    </div>
  );
};

// ── ACCENT BUTTON (Primary CTA 32px Radius) ────────────────────────────────
export interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const AccentButton: React.FC<AccentButtonProps> = ({
  label,
  icon: Icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        h-12 px-6 rounded-[32px] bg-[#00838F] text-white font-semibold text-[15px]
        flex items-center justify-center gap-2 shadow-[0_3px_6px_rgba(0,77,87,0.20)] transition-all duration-150
        hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

// ── STATUS BADGE ───────────────────────────────────────────────────────────
export type BadgeVariant = 'gold' | 'rose' | 'green' | 'teal' | 'neutral';

export const StatusBadge: React.FC<{ label: string; variant?: BadgeVariant; className?: string }> = ({
  label,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    rose: 'bg-[#FCE7F3] text-[#831843] border-[#FBCFE8] dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800',
    green: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    teal: 'bg-[#004D57]/20 text-[#00838F] border-[#00838F]/30',
    neutral: 'bg-[#1E293B] text-[#F8FAFC] border-[#334155]',
  }[variant];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[2px] border ${variantStyles} ${className}`}>
      {label}
    </span>
  );
};