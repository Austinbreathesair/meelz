import type { SelectHTMLAttributes } from 'react';

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <select className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...rest}>
      {children}
    </select>
  );
}

