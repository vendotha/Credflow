'use client';
export const dynamic = 'force-static';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <SignUp routing="hash" /> {/* <-- no path prop */}
    </div>
  );
}
