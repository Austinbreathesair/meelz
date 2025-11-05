"use client";
import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

type Transaction = {
  date: string;
  ingredient: string;
  quantity: number;
  unit_family: string;
  amount: number;
  reason: string;
};

type Report = {
  labels: string[];
  added: number[];
  used: number[];
  net: number[];
  summary: { total_added: number; total_used: number; total_net: number };
  range: number;
  transactions: Transaction[];
};

export default function DashboardClient() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const currency = 'R'; // South African Rand

  const load = async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report?days=${d}`, { cache: 'no-store' });
      if (!res.ok) return setData(null);
      const json = await res.json();
      console.log('Dashboard data:', json); // Debug log
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(days); 
    setCurrentPage(1); // Reset to first page when changing date range
  }, [days]);

  const hasData = !!data && (data.added.some((v) => v > 0) || data.used.some((v) => v > 0) || data.net.some((v) => v !== 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Range:</span>
        <Button size="sm" variant={days === 7 ? 'primary' : 'secondary'} onClick={() => { setDays(7); load(7); }}>7</Button>
        <Button size="sm" variant={days === 30 ? 'primary' : 'secondary'} onClick={() => { setDays(30); load(30); }}>30</Button>
        <Button size="sm" variant={days === 90 ? 'primary' : 'secondary'} onClick={() => { setDays(90); load(90); }}>90</Button>
      </div>
      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {!loading && (!data || !hasData) && (
        <EmptyState
          title="No budget data yet"
          description="Add pantry items with unit prices or create price snapshots to see costs here."
          action={<a className="underline" href="/pantry">Go to Pantry</a>}
        />
      )}
      {!loading && data && hasData && (
        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">Last {data.range} days</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 font-medium mb-1">Total Added</div>
                <div className="text-2xl font-bold text-green-900">{currency}{data.summary.total_added.toFixed(2)}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-xs text-red-700 font-medium mb-1">Total Used</div>
                <div className="text-2xl font-bold text-red-900">{currency}{data.summary.total_used.toFixed(2)}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-blue-700 font-medium mb-1">Net Change</div>
                <div className="text-2xl font-bold text-blue-900">{currency}{data.summary.total_net.toFixed(2)}</div>
              </div>
            </div>
            <BarChart 
              currency={currency} 
              labels={data.labels} 
              series={[
                { name: 'Added', values: data.added, color: '#10b981' }, 
                { name: 'Used', values: data.used, color: '#ef4444' }, 
                { name: 'Net', values: data.net, color: '#3b82f6' }
              ]} 
              height={500}
            />
          </section>

          {/* Transaction History Table */}
          {data.transactions && data.transactions.length > 0 && (() => {
            const totalPages = Math.ceil(data.transactions.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentTransactions = data.transactions.slice(startIndex, endIndex);
            
            return (
              <Card>
                <CardHeader 
                  title={`Transaction History`}
                  subtitle={`${data.transactions.length} total transactions • Page ${currentPage} of ${totalPages}`}
                />
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Date & Time</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Item</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                          <th className="text-right px-4 py-3 font-semibold text-gray-700">Quantity</th>
                          <th className="text-right px-4 py-3 font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentTransactions.map((txn, i) => {
                        const date = new Date(txn.date);
                        const reasonBadge = {
                          add: { tone: 'green' as const, label: '📦 Added' },
                          cook: { tone: 'blue' as const, label: '🍳 Cooking' },
                          expire: { tone: 'red' as const, label: '🗑️ Expired' },
                          delete: { tone: 'amber' as const, label: '❌ Deleted' },
                          adjust: { tone: 'gray' as const, label: '⚙️ Adjusted' }
                        }[txn.reason] || { tone: 'gray' as const, label: txn.reason };
                        
                        return (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-600">
                              <div className="font-medium">{date.toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{txn.ingredient}</div>
                              <div className="text-xs text-gray-500">{txn.unit_family || 'unknown'}</div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge tone={reasonBadge.tone}>{reasonBadge.label}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              <span className={txn.quantity >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {txn.quantity >= 0 ? '+' : ''}{txn.quantity.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              <span className={txn.amount >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {txn.amount >= 0 ? '+' : ''}{currency}{Math.abs(txn.amount).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, data.transactions.length)} of {data.transactions.length} transactions
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-aquamarine-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
}
