import Skeleton from '@/components/ui/Skeleton';

export default function LoadingCollection() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-64" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

