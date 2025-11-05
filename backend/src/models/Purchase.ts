import { Schema, model, Document, Types } from 'mongoose';

export interface IPurchase extends Document {
  userId: Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, default: 0 }
}, { timestamps: true });

export const Purchase = model<IPurchase>('Purchase', purchaseSchema);
