import './globals.css';
import SWRegister from '@/components/SWRegister';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Meelz',
  description: 'Pantry → Recipe PWA',
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl p-4">{children}</div>
        <SWRegister />
      </body>
    </html>
  );
}
