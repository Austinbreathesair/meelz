"use client";
import { useEffect, useMemo, useState } from 'react';
import { useIndexedDb } from '@/hooks/useIndexedDb';

function daysUntil(dateStr?: string | null) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function ExpiryBanner() {
  const db = useIndexedDb();
  const [count, setCount] = useState(0);
  useEffect(() => {
    db.pantry.toArray().then((rows) => {
      const soon = rows.filter((r) => daysUntil((r as any).expiry_date as any) <= 3);
      setCount(soon.length);
    }).catch(() => setCount(0));
  }, [db]);

  if (!count) return null;
  return (
    <div className="rounded border border-amber-300 bg-amber-50 text-amber-900 p-3">
      <strong className="mr-1">Important:</strong> {count} item{count === 1 ? '' : 's'} expiring soon.
    </div>
  );
}

