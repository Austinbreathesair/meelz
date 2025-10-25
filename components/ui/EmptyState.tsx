import type { PropsWithChildren, ReactNode } from 'react';

export default function EmptyState({ title, description, action }: { title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded border border-dashed bg-white p-8 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

