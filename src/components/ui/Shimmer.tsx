import React from 'react';

export const Shimmer = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`relative overflow-hidden bg-[#1E293B] rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#334155]/40 before:to-transparent ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="p-6 rounded-[24px] border border-[#334155] bg-[#1E293B] space-y-4">
    <div className="flex justify-between items-center">
      <Shimmer className="h-4 w-28 rounded-md" />
      <Shimmer className="h-8 w-8 rounded-full" />
    </div>
    <Shimmer className="h-8 w-44 rounded-md" />
    <Shimmer className="h-4 w-32 rounded-md" />
  </div>
);

export const SkeletonListTile = () => (
  <div className="p-4 rounded-[16px] border border-[#334155] bg-[#1E293B] flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Shimmer className="h-10 w-10 rounded-xl shrink-0" />
      <div className="space-y-2">
        <Shimmer className="h-4 w-32 rounded-md" />
        <Shimmer className="h-3 w-20 rounded-md" />
      </div>
    </div>
    <Shimmer className="h-5 w-24 rounded-md" />
  </div>
);