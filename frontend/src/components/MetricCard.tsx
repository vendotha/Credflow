import { ReactNode } from 'react';

export default function MetricCard({ title, value, hint }: { title: string; value: ReactNode; hint?: string; }) {
  return (
    <div className="card">
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  );
}
