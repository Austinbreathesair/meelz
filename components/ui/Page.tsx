import type { PropsWithChildren, ReactNode } from 'react';

export function Page({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <main className={`space-y-6 p-4 md:p-6 ${className}`}>{children}</main>;
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pb-2">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:gap-3">{actions}</div>}
    </div>
  );
}

