import 'dotenv/config';

export const env = {
  PORT: process.env.PORT ?? '8080',
  MONGODB_URI: process.env.MONGODB_URI!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!, // <-- add
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
};

['MONGODB_URI','CLERK_SECRET_KEY','CLERK_PUBLISHABLE_KEY'].forEach(k => {
  // @ts-ignore
  if (!env[k]) throw new Error(`Missing env ${k}`);
});
