"use client";
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
type Size = 'sm' | 'md' | 'lg';

export function Button({ children, className = '', variant = 'primary', size = 'md', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & { variant?: Variant; size?: Size }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  const variants: Record<Variant, string> = {
    primary: 'bg-aquamarine-500 text-white hover:bg-aquamarine-600 shadow-sm hover:shadow-md',
    gradient: 'bg-gradient-aqua text-white hover:shadow-lg hover:shadow-aquamarine-500/50 shadow-md',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md'
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
