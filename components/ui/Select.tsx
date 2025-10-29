import type { SelectHTMLAttributes } from 'react';

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <select className={`border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-aquamarine-500 focus:border-aquamarine-500 transition-all bg-white ${className}`} {...rest}>
      {children}
    </select>
  );
}

