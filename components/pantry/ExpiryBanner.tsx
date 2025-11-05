"use client";
import { useEffect, useState } from 'react';
import { useIndexedDb } from '@/hooks/useIndexedDb';
import { Badge } from '@/components/ui/Badge';

type ExpiringItem = {
  id: string;
  name: string;
  expiry_date?: string;
  qty?: number;
  unit?: string;
  daysUntil: number;
};

export function daysUntil(dateStr?: string | null) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getExpiryBadgeTone(days: number): 'red' | 'amber' | 'gray' {
  if (days <= 0) return 'red';      // Expired or expiring today
  if (days <= 3) return 'amber';    // Expiring soon (1-3 days)
  return 'gray';                     // Not urgent
}

function getUrgencyStyles(level: 'critical' | 'urgent' | 'warning') {
  switch (level) {
    case 'critical':
      return {
        border: 'border-red-500',
        bg: 'bg-red-50',
        text: 'text-red-900',
        icon: '🚨',
        label: 'Critical'
      };
    case 'urgent':
      return {
        border: 'border-orange-400',
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: '⚠️',
        label: 'Urgent'
      };
    case 'warning':
      return {
        border: 'border-amber-300',
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        icon: '⏰',
        label: 'Soon'
      };
  }
}

export function ExpiryBanner() {
  const db = useIndexedDb();
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Only try to load if db is actually available
    if (!db || !db.pantry) return;
    
    const loadExpiringItems = async () => {
      try {
        const rows = await db.pantry.toArray();
        const items: ExpiringItem[] = rows
          .map((r: any) => ({
            id: r.id,
            name: r.name,
            expiry_date: r.expiry_date,
            qty: r.qty,
            unit: r.unit,
            daysUntil: daysUntil(r.expiry_date)
          }))
          .filter((item) => item.daysUntil <= 7) // Show items expiring within 7 days
          .sort((a, b) => a.daysUntil - b.daysUntil); // Sort by urgency
        
        setExpiringItems(items);
      } catch (error) {
        console.error('Error loading expiring items:', error);
        setExpiringItems([]);
      }
    };

    loadExpiringItems();
    
    // Poll for changes every 30 seconds to catch new items
    const interval = setInterval(loadExpiringItems, 30000);
    return () => clearInterval(interval);
  }, [db]);

  if (expiringItems.length === 0) return null;

  // Group items by urgency
  const critical = expiringItems.filter(item => item.daysUntil <= 0);
  const urgent = expiringItems.filter(item => item.daysUntil > 0 && item.daysUntil <= 2);
  const warning = expiringItems.filter(item => item.daysUntil > 2 && item.daysUntil <= 7);

  // Determine the most urgent level for the banner color
  const urgencyLevel: 'critical' | 'urgent' | 'warning' = critical.length > 0 ? 'critical' : urgent.length > 0 ? 'urgent' : 'warning';
  const styles = getUrgencyStyles(urgencyLevel);

  const formatDaysText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
  };

  return (
    <div className={`rounded-lg border-2 ${styles.border} ${styles.bg} ${styles.text} overflow-hidden transition-all`}>
      {/* Banner Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:opacity-80 transition-opacity text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{styles.icon}</span>
          <div>
            <strong className="mr-1">{styles.label}:</strong>
            {expiringItems.length} item{expiringItems.length === 1 ? '' : 's'} expiring soon
            {critical.length > 0 && <span className="ml-2 font-bold">(⚠️ {critical.length} expired/expiring today!)</span>}
          </div>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content - Shows list of items */}
      {isExpanded && (
        <div className="border-t-2 border-current p-3 space-y-4">
          {/* Critical Items (Expired or expiring today) */}
          {critical.length > 0 && (
            <div>
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                🚨 Critical ({critical.length})
              </h4>
              <ul className="space-y-2">
                {critical.map((item) => (
                  <li key={item.id} className="bg-white bg-opacity-50 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      {item.qty && <span className="text-sm ml-2">({item.qty} {item.unit || ''})</span>}
                    </div>
                    <Badge tone="red" className="whitespace-nowrap">
                      {formatDaysText(item.daysUntil)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Urgent Items (1-2 days) */}
          {urgent.length > 0 && (
            <div>
              <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                ⚠️ Urgent ({urgent.length})
              </h4>
              <ul className="space-y-2">
                {urgent.map((item) => (
                  <li key={item.id} className="bg-white bg-opacity-50 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      {item.qty && <span className="text-sm ml-2">({item.qty} {item.unit || ''})</span>}
                    </div>
                    <Badge tone="amber" className="whitespace-nowrap">
                      {formatDaysText(item.daysUntil)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Items (3-7 days) */}
          {warning.length > 0 && (
            <div>
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                ⏰ Soon ({warning.length})
              </h4>
              <ul className="space-y-2">
                {warning.map((item) => (
                  <li key={item.id} className="bg-white bg-opacity-50 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      {item.qty && <span className="text-sm ml-2">({item.qty} {item.unit || ''})</span>}
                    </div>
                    <Badge tone="gray" className="whitespace-nowrap">
                      {formatDaysText(item.daysUntil)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs opacity-75 mt-2 pt-2 border-t border-current">
            💡 Tip: Use these items first or freeze them to avoid waste
          </div>
        </div>
      )}
    </div>
  );
}
