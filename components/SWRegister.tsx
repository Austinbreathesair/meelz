"use client";
import { useEffect } from 'react';

export default function SWRegister() {
  useEffect(() => {
    // Temporarily disabled - service worker causing redirect issues
    // Will re-enable after fixing OAuth callback handling
    
    // Unregister any existing service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }, []);
  return null;
}
