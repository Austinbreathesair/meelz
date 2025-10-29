import type { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input className={`border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-aquamarine-500 focus:border-aquamarine-500 transition-all ${className}`} {...rest} />;
}

