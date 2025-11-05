import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Referral } from '../models/Referral.js';
import { Purchase } from '../models/Purchase.js';

export async function recordFirstPurchaseAndCredit(userId: string, amount: number) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchaser = await User.findById(userId).session(session);
    if (!purchaser) throw new Error('User not found');

    // Create purchase record
    await Purchase.create([{ userId: purchaser._id, amount }], { session });

    // If already credited, just commit.
    if (purchaser.firstPurchaseCredited) {
      await session.commitTransaction();
      return { credited: false };
    }

    // Find referral relation (unique per referred user)
    const ref = await Referral.findOne({ referredUserId: purchaser._id }).session(session);

    if (ref && ref.status === 'pending') {
      // Credit both referrer and referred
      await User.updateOne({ _id: ref.referrerUserId }, { $inc: { credits: 2 } }).session(session);
      await User.updateOne({ _id: purchaser._id }, { $inc: { credits: 2 }, $set: { firstPurchaseCredited: true } }).session(session);
      await Referral.updateOne({ _id: ref._id }, { $set: { status: 'converted', convertedAt: new Date() } }).session(session);

      await session.commitTransaction();
      return { credited: true };
    } else {
      // Not referred or already converted → mark only firstPurchaseCredited so it won't credit later
      await User.updateOne({ _id: purchaser._id }, { $set: { firstPurchaseCredited: true } }).session(session);
      await session.commitTransaction();
      return { credited: false };
    }

  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}
