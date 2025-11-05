'use client';
import { useEffect } from 'react';

export default function ReferralCapture() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const r = url.searchParams.get('r');
      if (r) {
        localStorage.setItem('referralCode', r);
        // Optional: remove from visible URL (clean bar)
        url.searchParams.delete('r');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  }, []);
  return null;
}
