'use client';

import React from 'react';

interface CurrencyInputProps {
  value: string | number;
  onChange: (rawValue: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const formatThousand = (val: string | number): string => {
  if (!val && val !== 0) return '';
  const cleanNum = val.toString().replace(/[^0-9]/g, '');
  if (!cleanNum) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(cleanNum, 10));
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  className = '',
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    onChange(rawVal);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      required={required}
      placeholder={placeholder}
      value={formatThousand(value)}
      onChange={handleChange}
      className={className}
    />
  );
};