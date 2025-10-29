"use client";
import { useRef, useState } from 'react';
import type React from 'react';
type Series = { name: string; values: number[]; color: string };

export default function BarChart({ labels, series, height = 200, currency = 'R' }: { labels: string[]; series: Series[]; height?: number; currency?: string }) {
  // Use 75% of max value to zoom in and make small variations more visible
  const actualMax = Math.max(1, ...series.flatMap((s) => s.values));
  const max = actualMax * 0.75; // Zoom in by 25%
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

  return (
    <div className="w-full relative bg-gray-50 rounded-lg p-4" ref={containerRef} onMouseLeave={onLeave}>
      <div className="flex items-end justify-between gap-1" style={{ height, minHeight: '200px' }}>
        {labels.map((label, i) => {
          const hasData = series.some(s => s.values[i] && s.values[i] > 0);
          return (
            <div 
              key={i} 
              className="flex-1 flex items-end justify-center gap-0.5 cursor-pointer hover:bg-gray-100 rounded transition-colors" 
              onMouseMove={(e) => onEnter(i, e)}
              style={{ minWidth: '4px' }}
            >
              {series.map((s) => {
                const value = s.values[i] || 0;
                const heightPercent = max > 0 ? Math.min((value / max * 100), 100) : 0;
                return (
                  <div 
                    key={s.name}
                    style={{ 
                      height: heightPercent > 0 ? `${heightPercent}%` : '2px',
                      backgroundColor: s.color,
                      minHeight: value > 0 ? '8px' : '0px'
                    }}
                    className="flex-1 max-w-[12px] rounded-t transition-all"
                  ></div>
                );
              })}
              {!hasData && (
                <div className="flex-1 max-w-[12px] h-0.5 bg-gray-300 rounded"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${barCount}, minmax(0, 1fr))` }}>
        {labels.map((l, i) => (
          <div key={i} className="text-center text-[10px] text-gray-500 truncate">{l.slice(5)}</div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 pt-3 border-t border-gray-200">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: s.color }}></span>
            <span className="font-medium">{s.name}</span>
          </div>
        ))}
        <div className="ml-auto text-xs text-gray-500">Currency: {currencySymbol}</div>
      </div>
      {tip && (
        <div className="pointer-events-none absolute bg-gray-900 text-white border-0 rounded-lg shadow-lg px-3 py-2 text-xs z-50" style={{ left: tip.x, top: tip.y }} dangerouslySetInnerHTML={{ __html: tip.html }} />
      )}
    </div>
  );
}
