import type { HTMLAttributes } from 'react';

type Name = 'pantry' | 'recipes' | 'shopping' | 'budget' | 'saved' | 'collections';

export default function Icon({ name, filled = false, className = '', ...rest }: { name: Name; filled?: boolean } & HTMLAttributes<SVGSVGElement>) {
  const common = 'w-5 h-5';
  if (name === 'pantry') {
    return filled ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3V6Zm0 4h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Zm5 2v6h2v-6H8Zm6 0v6h2v-6h-2Z"/></svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/><path d="M10 12v6M14 12v6"/></svg>
    );
  }
  if (name === 'recipes') {
    return filled ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M7 3a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2H7Z"/></svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-7-3-7 3Z"/></svg>
    );
  }
  if (name === 'shopping') {
    return filled ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M7 7V6a5 5 0 1 1 10 0v1h3v2l-1.4 11.2A2 2 0 0 1 16.62 22H7.38a2 2 0 0 1-1.98-1.8L4 9V7h3Zm2 0h6V6a3 3 0 1 0-6 0v1Z"/></svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><path d="M7 7V6a5 5 0 1 1 10 0v1"/><path d="M4 9h16"/><path d="M6 9 7.4 20.2A2 2 0 0 0 9.38 22h5.24a2 2 0 0 0 1.98-1.8L18 9"/></svg>
    );
  }
  if (name === 'saved') {
    return filled ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"/></svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"/></svg>
    );
  }
  if (name === 'collections') {
    return filled ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>
    );
  }
  // budget
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${common} ${className}`} {...rest}><path d="M3 5h18v4H3V5Zm0 6h18v8H3v-8Zm4 2v4h4v-4H7Z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${common} ${className}`} {...rest}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><rect x="7" y="13" width="4" height="4"/></svg>
  );
}
