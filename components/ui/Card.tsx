import type { PropsWithChildren, ReactNode } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded border bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ title, actions }: { title?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="font-medium">{title}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}

