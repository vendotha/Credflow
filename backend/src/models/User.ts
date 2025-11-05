import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document { 
  clerkUserId: string;
  email: string;
  name: string;
  referralCode: string;
  credits: number;
  firstPurchaseCredited: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  clerkUserId: { type: String, required: true, unique: true, index: true },
  email:       { type: String, required: true, index: true },
  name:        { type: String, default: '' },
  referralCode:{ type: String, required: true, unique: true, index: true },
  credits:     { type: Number, default: 0 },
  firstPurchaseCredited: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
