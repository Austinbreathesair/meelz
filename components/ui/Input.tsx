import type { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...rest} />;
}

