const PIN_KEY = 'monflow_user_pin_hash';
const PIN_SALT = 'monflow_salt_v1_'; //

export const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${PIN_SALT}${pin}`); //
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const savePin = async (pin: string): Promise<void> => {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_KEY, hash);
};

export const verifyPin = async (pin: string): Promise<boolean> => {
  const savedHash = localStorage.getItem(PIN_KEY);
  if (!savedHash) return false;
  const inputHash = await hashPin(pin);
  return inputHash === savedHash;
};

export const hasPinSet = (): boolean => {
  return !!localStorage.getItem(PIN_KEY);
};

export const removePin = (): void => {
  localStorage.removeItem(PIN_KEY);
};