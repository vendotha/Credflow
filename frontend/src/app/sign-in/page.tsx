'use client';
export const dynamic = 'force-static';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <SignIn routing="hash" /> {/* <-- no path prop */}
    </div>
  );
}
