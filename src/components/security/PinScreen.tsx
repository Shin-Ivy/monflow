'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Delete, ShieldCheck, X } from 'lucide-react';
import { useSecurityStore } from '@/store/useSecurityStore';
import { useToastStore } from '@/store/useToastStore';

export type PinMode = 'verify' | 'setup' | 'change'; //[cite: 2]

interface PinScreenProps {
  mode?: PinMode;
  isOpen?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({
  mode = 'verify',
  isOpen = true,
  onSuccess,
  onClose,
}) => {
  const { isLocked, unlockWithPin, setupNewPin } = useSecurityStore();
  const { showToast } = useToastStore();

  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
  }, [isOpen, mode]);

  if (!isOpen && (!isLocked || mode !== 'verify')) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 6) {
        handleCompletePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPin('');
  };

  const handleCompletePin = async (inputPin: string) => {
    if (mode === 'verify') {
      const success = await unlockWithPin(inputPin);
      if (success) {
        showToast('Aplikasi berhasil dibuka', 'success');
        onSuccess?.();
      } else {
        triggerShake();
        showToast('PIN salah. Silakan coba lagi', 'error'); //[cite: 2]
      }
    } else if (mode === 'setup' || mode === 'change') {
      if (step === 'enter') {
        setConfirmPin(inputPin);
        setPin('');
        setStep('confirm');
      } else {
        if (inputPin === confirmPin) {
          await setupNewPin(inputPin);
          showToast('PIN 6-Digit berhasil disimpan!', 'success'); //[cite: 2]
          onSuccess?.();
          onClose?.();
        } else {
          triggerShake();
          showToast('Konfirmasi PIN tidak cocok. Ulangi!', 'error');
          setStep('enter');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#070B14]/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center space-y-6 text-center">
        {onClose && mode !== 'verify' && (
          <button
            onClick={onClose}
            className="self-end p-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        {/* Logo & Judul */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004D57] to-[#023840] border border-[#00838F]/40 flex items-center justify-center text-[#00838F] shadow-[0_4px_16px_rgba(0,77,87,0.4)]">
          <Lock size={26} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">
            {mode === 'verify'
              ? 'Verifikasi PIN Keamanan' //[cite: 2]
              : step === 'enter'
              ? 'Buat PIN 6-Digit Baru' //[cite: 2]
              : 'Konfirmasi PIN Anda'}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            {mode === 'verify'
              ? 'Masukkan 6 digit kode PIN untuk membuka workspace MonFlow.'
              : step === 'enter'
              ? 'PIN digunakan untuk mengamankan pembukuan di browser ini.'
              : 'Ketik ulang 6 digit PIN yang sama persis.'}
          </p>
        </div>

        {/* Indikator 6 Digit Dots */}
        <div className={`flex justify-center gap-3.5 py-4 ${isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length
                  ? 'bg-[#00838F] border-[#00838F] scale-110 shadow-[0_0_8px_#00838F]'
                  : 'border-[#334155] bg-[#0B1120]'
              }`}
            />
          ))}
        </div>

        {/* Keypad Numeric */}
        <div className="grid grid-cols-3 gap-3.5 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="h-16 rounded-[18px] bg-[#1E293B] border border-[#334155]/80 text-[#F8FAFC] text-2xl font-bold font-mono hover:bg-[#243248] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-[18px] bg-[#1E293B] border border-[#334155]/80 text-[#F8FAFC] text-2xl font-bold font-mono hover:bg-[#243248] active:scale-95 transition-all cursor-pointer shadow-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-[18px] bg-[#1E293B]/60 border border-[#334155]/80 text-[#94A3B8] flex items-center justify-center hover:text-red-400 hover:bg-[#1E293B] active:scale-95 transition-all cursor-pointer"
          >
            <Delete size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};