import { Schema, model, Document, Types } from 'mongoose';

export type ReferralStatus = 'pending' | 'converted';

export interface IReferral extends Document {
  referrerUserId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  status: ReferralStatus;
  createdAt: Date;
  convertedAt?: Date;
}

const referralSchema = new Schema<IReferral>({
  referrerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  status: { type: String, enum: ['pending','converted'], default: 'pending' },
  convertedAt: Date
}, { timestamps: true });

export const Referral = model<IReferral>('Referral', referralSchema);
