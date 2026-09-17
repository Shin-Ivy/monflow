import { create } from 'zustand';
import { hasPinSet, verifyPin, savePin, removePin } from '@/lib/security';

interface SecurityState {
  isPinEnabled: boolean;
  isLocked: boolean;
  initSecurity: () => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  setupNewPin: (pin: string) => Promise<void>;
  disablePin: () => void;
  lockApp: () => void;
  unlockApp: () => void; // Fungsi pembuka kunci langsung setelah verifikasi berhasil
}

export const useSecurityStore = create<SecurityState>((set) => ({
  isPinEnabled: false,
  isLocked: false,

  initSecurity: () => {
    const pinActive = hasPinSet();
    set({
      isPinEnabled: pinActive,
      isLocked: pinActive, // Kunci otomatis jika PIN telah diatur
    });
  },

  unlockWithPin: async (pin: string) => {
    const isValid = await verifyPin(pin);
    if (isValid) {
      set({ isLocked: false });
      return true;
    }
    return false;
  },

  setupNewPin: async (pin: string) => {
    await savePin(pin);
    set({ isPinEnabled: true, isLocked: false });
  },

  disablePin: () => {
    removePin();
    set({ isPinEnabled: false, isLocked: false });
  },

  lockApp: () => {
    if (hasPinSet()) {
      set({ isLocked: true });
    }
  },

  unlockApp: () => {
    set({ isLocked: false });
  },
}));