import type { Metadata } from 'next';
import ReferralCapture from '@/components/ReferralCapture';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'FileSure – Referral',
  description: 'Referral & Credit System'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en">
        <body className="min-h-screen">
          <ReferralCapture /> {/* <-- add this */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
