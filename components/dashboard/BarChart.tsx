"use client";
import { useRef, useState } from 'react';
import type React from 'react';
type Series = { name: string; values: number[]; color: string };

export default function BarChart({ labels, series, height = 400, currency = 'R' }: { labels: string[]; series: Series[]; height?: number; currency?: string }) {
  // Get the maximum value from all series (use absolute values to handle any negatives)
  const actualMax = Math.max(1, ...series.flatMap((s) => s.values.map(v => Math.abs(v))));
  // Add 10% padding at top for better visualization
  const max = actualMax * 1.1;
  const barCount = labels.length;
  const [tip, setTip] = useState<{ x: number; y: number; html: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onEnter = (i: number, e: React.MouseEvent) => {
    const parts = series
      .map((s) => `<div><span style="display:inline-block;width:8px;height:8px;background:${s.color};border-radius:2px;margin-right:6px"></span>${s.name}: ${currency}${(s.values[i] || 0).toFixed(2)}</div>`) 
      .join('');
    const html = `<strong>${labels[i]}</strong>${parts ? `<div style="margin-top:4px">${parts}</div>` : ''}`;
    const rect = containerRef.current?.getBoundingClientRect();
    setTip({ x: (e.clientX - (rect?.left || 0)) + 8, y: (e.clientY - (rect?.top || 0)) - 24, html });
  };
  const onLeave = () => setTip(null);
  const currencySymbol = currency;

  // Calculate bar group width based on number of days
  const barGroupWidth = barCount <= 7 ? 80 : barCount <= 30 ? 50 : 35;
  
  return (
    <div className="w-full relative bg-white rounded-lg p-6 border border-gray-200" ref={containerRef} onMouseLeave={onLeave}>
      <div className={`flex items-end ${barCount > 7 ? 'overflow-x-auto' : 'justify-around'} gap-4`} style={{ height, minHeight: height }}>
        {labels.map((label, i) => {
          const hasData = series.some(s => s.values[i] && Math.abs(s.values[i]) > 0);
          return (
            <div 
              key={i} 
              className="flex items-end justify-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors p-2" 
              onMouseMove={(e) => onEnter(i, e)}
              style={{ 
                width: `${barGroupWidth}px`,
                minWidth: `${barGroupWidth}px`
              }}
            >
              {series.map((s) => {
                const value = Math.abs(s.values[i] || 0);
                const heightPercent = max > 0 ? Math.min((value / max * 100), 100) : 0;
                return (
                  <div 
                    key={s.name}
                    style={{ 
                      height: heightPercent > 0 ? `${heightPercent}%` : '2px',
                      backgroundColor: s.color,
                      minHeight: value > 0 ? '20px' : '0px',
                      width: `${Math.floor(barGroupWidth / 3 - 3)}px`
                    }}
                    className="rounded-t-md transition-all shadow-md hover:shadow-lg"
                    title={`${s.name}: ${currency}${value.toFixed(2)}`}
                  ></div>
                );
              })}
              {!hasData && (
                <div style={{ width: `${Math.floor(barGroupWidth / 3)}px` }} className="h-1 bg-gray-200 rounded"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className={`mt-6 flex ${barCount > 7 ? 'overflow-x-auto' : 'justify-around'} gap-4`}>
        {labels.map((l, i) => (
          <div 
            key={i} 
            className="text-center text-[10px] text-gray-600 font-medium" 
            title={l}
            style={{ 
              width: `${barGroupWidth}px`,
              minWidth: `${barGroupWidth}px`
            }}
          >
            {barCount > 60 ? (i % 7 === 0 || i === 0 ? l.slice(5) : '·') : l.slice(5)}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-700 pt-4 border-t border-gray-200">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded shadow-sm" style={{ backgroundColor: s.color }}></span>
            <span className="font-semibold">{s.name}</span>
          </div>
        ))}
        <div className="ml-auto text-sm text-gray-500 font-medium">Currency: {currencySymbol}</div>
      </div>
      {tip && (
        <div className="pointer-events-none absolute bg-gray-900 text-white border-0 rounded-lg shadow-lg px-3 py-2 text-xs z-50" style={{ left: tip.x, top: tip.y }} dangerouslySetInnerHTML={{ __html: tip.html }} />
      )}
    </div>
  );
}
