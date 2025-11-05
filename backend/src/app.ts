import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { health } from './routes/health.js';
import { user } from './routes/user.js';
import { referral } from './routes/referral.js';
import { purchase } from './routes/purchase.js';
import { clerkMiddleware } from '@clerk/express';

export const app = express();

app.use(express.json());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

// ✅ Provide both keys explicitly so Clerk doesn't rely on process.env names
app.use(clerkMiddleware({
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
}));

app.use('/api/health', health);
app.use('/api/users', user);
app.use('/api/referrals', referral);
app.use('/api/purchases', purchase);
