"use client";
import { useEffect } from 'react';

export default function SWRegister() {
  useEffect(() => {
    // Register service worker in production AND development for PWA testing
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        reg.update().catch(() => {});
      }).catch(() => {});
      const onControllerChange = () => window.location.reload();
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    }
  }, []);
  return null;
}
