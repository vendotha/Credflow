'use client';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <>
      <Header/>
      <main className="mx-auto max-w-6xl px-4 py-14">
        <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
          className="text-4xl sm:text-5xl font-bold tracking-tight">
          Grow with Referrals. Earn Credits.
        </motion.h1>
        <p className="mt-4 text-[var(--muted)] max-w-2xl">
          Invite friends. When they make their first purchase, both of you earn credits—simple.
        </p>
        <div className="mt-8 flex gap-3">
          <SignedOut><Link className="btn" href="/sign-up">Get Started</Link></SignedOut>
          <SignedIn><Link className="btn" href="/dashboard">Open Dashboard</Link></SignedIn>
        </div>
      </main>
    </>
  );
}
