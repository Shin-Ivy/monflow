'use client';

import React from 'react';
import { DateFilterPreset, DATE_FILTER_OPTIONS } from '@/lib/dateUtils';

interface DateFilterSelectorProps {
  currentPreset: DateFilterPreset;
  onSelectPreset: (preset: DateFilterPreset) => void;
}

export const DateFilterSelector: React.FC<DateFilterSelectorProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#1E293B] border border-[#334155] rounded-[14px] overflow-x-auto max-w-full">
      {DATE_FILTER_OPTIONS.map((opt) => {
        const isActive = currentPreset === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelectPreset(opt.key)}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#004D57] to-[#023840] text-[#F8FAFC] border border-[#00838F]/50 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1120]/60'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};