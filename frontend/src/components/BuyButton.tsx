'use client';
import { useState } from 'react';

export default function BuyButton({ onBuy }: { onBuy: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="btn w-full py-3 text-lg"
      disabled={loading}
      onClick={async () => { setLoading(true); try { await onBuy(); } finally { setLoading(false); } }}
    >
      {loading ? 'Processing…' : 'Buy Product (₹0 demo)'}
    </button>
  );
}
