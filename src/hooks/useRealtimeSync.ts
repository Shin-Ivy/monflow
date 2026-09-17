'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useFinancialStore } from '@/store/useFinancialStore';

export const useRealtimeSync = () => {
  const { isCloudMode, userId, init } = useFinancialStore();

  useEffect(() => {
    if (!isCloudMode || !userId) return;

    // Pasang channel WebSocket Supabase Realtime
    const channel = supabase
      .channel('monflow_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', filter: `user_id=eq.${userId}` },
        () => {
          // Sinkronisasi data lokal ketika ada perubahan dari perangkat lain
          init();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isCloudMode, userId, init]);
};