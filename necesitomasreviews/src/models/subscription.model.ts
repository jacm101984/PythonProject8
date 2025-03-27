// src/models/subscription.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'basic' | 'premium';
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
  paymentMethod: string;
  paymentId: string;
  status: 'active' | 'canceled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    plan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    endDate: {
      type: Date,
      default: null
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    paymentMethod: {
      type: String,
      default: ''
    },
    paymentId: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Índice compuesto para búsquedas comunes
SubscriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);