'use client';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import CopyField from '@/components/CopyField';
import BuyButton from '@/components/BuyButton';
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { authedFetch } from '@/lib/api';
import { APP_BASE } from '@/lib/config';
import { useAuth, useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { user, stats, setUser, setStats, setLoading } = useAppStore();

  const referralUrl = useMemo(
    () => (user ? `${APP_BASE}/?r=${encodeURIComponent(user.referralCode)}` : ''),
    [user]
  );

  useEffect(() => {
    (async () => {
      if (!clerkUser) return;
      setLoading(true);
      try {
        // 1) Ensure user exists in our DB (idempotent)
        const meInit = await authedFetch(
          '/api/users/init',
          {
            method: 'POST',
            body: JSON.stringify({
              email: clerkUser.primaryEmailAddress?.emailAddress,
              name: clerkUser.fullName,
            }),
          },
          getToken
        );
        setUser(meInit as any);

        // 2) Bind referral: prefer ?r= in URL; fallback to localStorage
        let code: string | null = null;
        try {
          const urlNow = new URL(window.location.href);
          code = urlNow.searchParams.get('r');
          if (!code) code = localStorage.getItem('referralCode');
          if (code) {
            await authedFetch(
              '/api/referrals/bind',
              { method: 'POST', body: JSON.stringify({ code }) },
              getToken
            ).catch(() => {}); // binding is idempotent; ignore benign errors
            // Clean up URL + cache
            urlNow.searchParams.delete('r');
            window.history.replaceState({}, '', urlNow.toString());
            try { localStorage.removeItem('referralCode'); } catch {}
          }
        } catch {
          // ignore client storage/URL issues
        }

        // 3) Load fresh profile + stats
        const me = await authedFetch('/api/users/me', {}, getToken);
        setUser(me as any);
        const s = await authedFetch('/api/referrals/stats', {}, getToken);
        setStats(s as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [clerkUser, getToken, setLoading, setStats, setUser]);

  const handleBuy = async () => {
    await authedFetch(
      '/api/purchases',
      { method: 'POST', body: JSON.stringify({ amount: 0 }) },
      getToken
    );
    // Refresh stats + user credits after purchase
    const s = await authedFetch('/api/referrals/stats', {}, getToken);
    setStats(s as any);
    const me = await authedFetch('/api/users/me', {}, getToken);
    setUser(me as any);
    alert('Purchase complete! Credits applied if eligible.');
  };

  return (
    <>
      <Header />
      <SignedOut>
        <div className="p-8"><RedirectToSignIn /></div>
      </SignedOut>
      <SignedIn>
        <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
          <section className="grid-cards">
            <MetricCard title="Total Referred Users" value={stats?.totalReferredUsers ?? 0} />
            <MetricCard title="Converted Users" value={stats?.convertedUsers ?? 0} />
            <MetricCard
              title="Total Credits"
              value={stats?.totalCredits ?? 0}
              hint="2 credits awarded on first purchase only"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <CopyField label="Your unique referral link" value={referralUrl || 'loading…'} />
            <div className="card flex flex-col gap-4">
              <div className="text-sm text-[var(--muted)]">Simulate a purchase</div>
              <BuyButton onBuy={handleBuy} />
              <div className="text-xs text-[var(--muted)]">
                Only the first purchase by a referred user triggers 2 credits to both users.
              </div>
            </div>
          </section>
        </main>
      </SignedIn>
    </>
  );
}
