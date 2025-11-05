import { Router, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { generateReferralCode } from '../utils/generateCode.js';
import { requireAuth, getAuth } from '@clerk/express'; // ✅

export const user = Router();

user.post('/init', requireAuth(), async (req, res: Response) => {  // ✅ guard
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(0).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { userId } = getAuth(req);                                 // ✅ read userId
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { email, name } = parsed.data;

  let doc = await User.findOne({ clerkUserId: userId });
  if (!doc) {
    const referralCode = generateReferralCode(name || email);
    doc = await User.create({ clerkUserId: userId, email, name: name || '', referralCode });
  }
  res.json({
    id: String(doc._id),
    email: doc.email,
    name: doc.name,
    credits: doc.credits,
    referralCode: doc.referralCode
  });
});

user.get('/me', requireAuth(), async (req, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const u = await User.findOne({ clerkUserId: userId });
  if (!u) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: String(u._id),
    email: u.email,
    name: u.name,
    credits: u.credits,
    referralCode: u.referralCode
  });
});
