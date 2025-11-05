'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#1e2741] bg-[#0b0f19]/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="flex items-center gap-3">
          <img src="/logo.svg" className="h-7" alt="logo"/>
          <span className="font-semibold tracking-wide text-[var(--muted)]">FileSure Referral</span>
        </motion.div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="hover:opacity-80">Home</Link>
          <Link href="/dashboard" className="hover:opacity-80">Dashboard</Link>
          <SignedIn><UserButton/></SignedIn>
          <SignedOut>
            <Link className="btn" href="/sign-in">Sign in</Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
