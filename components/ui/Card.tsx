import type { PropsWithChildren, ReactNode } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, actions }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

