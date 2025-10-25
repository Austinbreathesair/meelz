import type { PropsWithChildren } from 'react';

type Tone = 'gray' | 'blue' | 'green' | 'amber' | 'red';

export function Badge({ children, tone = 'gray', className = '' }: PropsWithChildren<{ tone?: Tone; className?: string }>) {
  const map: Record<Tone, string> = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${map[tone]} ${className}`}>{children}</span>;
}

