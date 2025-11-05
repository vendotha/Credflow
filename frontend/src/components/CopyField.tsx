'use client';
import { useState } from 'react';

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card">
      <div className="text-sm text-[var(--muted)] mb-2">{label}</div>
      <div className="flex gap-3">
        <input readOnly className="input" value={value}/>
        <button className="btn" onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false),1200); }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
