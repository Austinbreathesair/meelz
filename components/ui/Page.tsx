import type { PropsWithChildren, ReactNode } from 'react';

export function Page({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <main className={`space-y-6 p-6 ${className}`}>{children}</main>;
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between pb-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

