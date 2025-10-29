import type { ReactNode } from 'react';

export default function EmptyState({ title, description, action }: { title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-gray-600 mt-2 text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
