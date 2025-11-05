import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { health } from './routes/health.js';
import { user } from './routes/user.js';
import { referral } from './routes/referral.js';
import { purchase } from './routes/purchase.js';
import { clerkMiddleware } from '@clerk/express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

// ✅ Provide both keys explicitly so Clerk doesn't rely on process.env names
app.use(clerkMiddleware({
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
}));

const swaggerDocument = YAML.load(path.resolve(__dirname, '../openapi.yaml'));


app.use('/api/health', health);
app.use('/api/users', user);
app.use('/api/referrals', referral);
app.use('/api/purchases', purchase);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/openapi.json', (_req, res) => res.json(swaggerDocument));
