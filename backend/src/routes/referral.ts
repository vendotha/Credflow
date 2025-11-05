import { Router, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Referral } from '../models/Referral.js';
import { requireAuth, getAuth } from '@clerk/express'; // ✅

export const referral = Router();

referral.get('/link', requireAuth(), async (req, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const u = await User.findOne({ clerkUserId: userId });
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json({ referralCode: u.referralCode });
});

referral.post('/bind', requireAuth(), async (req, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const schema = z.object({ code: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const current = await User.findOne({ clerkUserId: userId });
  if (!current) return res.status(404).json({ error: 'User not found' });

  if (current.referralCode === parsed.data.code) {
    return res.status(400).json({ error: 'Cannot use your own referral code' });
  }
  const existing = await Referral.findOne({ referredUserId: current._id });
  if (existing) return res.json({ ok: true, alreadyBound: true });

  const referrer = await User.findOne({ referralCode: parsed.data.code });
  if (!referrer) return res.status(404).json({ error: 'Invalid referral code' });

  await Referral.create({ referrerUserId: referrer._id, referredUserId: current._id, status: 'pending' });
  res.json({ ok: true });
});

referral.get('/stats', requireAuth(), async (req, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const me = await User.findOne({ clerkUserId: userId });
  if (!me) return res.status(404).json({ error: 'User not found' });

  const totalReferred = await Referral.countDocuments({ referrerUserId: me._id });
  const converted = await Referral.countDocuments({ referrerUserId: me._id, status: 'converted' });

  res.json({
    totalReferredUsers: totalReferred,
    convertedUsers: converted,
    totalCredits: me.credits
  });
});
