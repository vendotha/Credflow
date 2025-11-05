import { Router, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { recordFirstPurchaseAndCredit } from '../services/referralService.js';
import { requireAuth, getAuth } from '@clerk/express'; // ✅

export const purchase = Router();

purchase.post('/', requireAuth(), async (req, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const schema = z.object({ amount: z.number().min(0).default(10) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const me = await User.findOne({ clerkUserId: userId });
  if (!me) return res.status(404).json({ error: 'User not found' });

  const result = await recordFirstPurchaseAndCredit(String(me._id), parsed.data.amount);
  res.json({ ok: true, credited: result.credited });
});
