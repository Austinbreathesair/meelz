import type { PropsWithChildren, ReactNode } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ title, actions }: { title?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <div className="font-semibold text-gray-900">{title}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

