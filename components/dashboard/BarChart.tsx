"use client";
import { useRef, useState } from 'react';
import type React from 'react';
type Series = { name: string; values: number[]; color: string };

export default function BarChart({ labels, series, height = 160, currency = '$' }: { labels: string[]; series: Series[]; height?: number; currency?: string }) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
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
    <div className="w-full relative" ref={containerRef} onMouseLeave={onLeave}>
      <div className="flex items-end gap-1" style={{ height }}>
        {labels.map((label, i) => (
          <div key={i} className="flex-1 flex items-end gap-0.5" onMouseMove={(e) => onEnter(i, e)}>
            {series.map((s) => (
              <div key={s.name}
                style={{ height: `${(s.values[i] || 0) / max * 100}%`, backgroundColor: s.color }}
                className="w-1.5 rounded-t"></div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${barCount}, minmax(0, 1fr))` }}>
        {labels.map((l, i) => (
          <div key={i} className="text-center text-[10px] text-gray-500">{l.slice(5)}</div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-gray-600">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: s.color }}></span>{s.name}</div>
        ))}
        <div className="ml-auto text-xs text-gray-500">Currency: {currencySymbol}</div>
      </div>
      {tip && (
        <div className="pointer-events-none absolute bg-white border rounded shadow px-2 py-1 text-xs" style={{ left: tip.x, top: tip.y }} dangerouslySetInnerHTML={{ __html: tip.html }} />
      )}
    </div>
  );
}
