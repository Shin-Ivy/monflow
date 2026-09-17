'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AccentButton } from '@/components/ui/Kit';
import { Lock, Mail, UserCheck, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registrasi berhasil! Silakan periksa email Anda untuk verifikasi atau langsung login.');
        setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleGuestMode = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen bg-[#070B14] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-[24px] p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#004D57] border border-[#00838F]/40 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            M
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">MonFlow Web</h1>
          <p className="text-xs text-[#94A3B8]">
            {isRegister ? 'Buat akun untuk mencadangkan pembukuan ke cloud' : 'Masuk untuk sinkronisasi data finansial Anda'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00838F]"
              />
            </div>
          </div>

          <AccentButton
            type="submit"
            label={isLoading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk ke Workspace'}
            isLoading={isLoading}
            className="w-full !h-12 cursor-pointer"
          />
        </form>

        {/* Pemisah */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#334155] w-full" />
          <span className="bg-[#1E293B] px-3 text-[10px] font-bold text-[#64748B] uppercase absolute">Atau</span>
        </div>

        {/* Alternatif Login: Google & Guest */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-[#0B1120] border border-[#334155] rounded-[14px] text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 hover:bg-[#243248] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Masuk dengan Akun Google
          </button>

          <button
            type="button"
            onClick={handleGuestMode}
            className="w-full h-11 bg-transparent border border-dashed border-[#334155] rounded-[14px] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#00838F]/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <UserCheck size={14} />
            Lanjut Offline / Tamu <ArrowRight size={14} />
          </button>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#00838F] hover:underline font-semibold cursor-pointer"
          >
            {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar gratis'}
          </button>
        </div>
      </div>
    </div>
  );
}