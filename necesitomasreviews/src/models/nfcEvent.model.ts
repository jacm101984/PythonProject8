// src/models/nfcEvent.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface INFCEvent extends Document {
  cardId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  eventType: 'scan' | 'review_started' | 'review_completed';
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  deviceInfo?: {
    type: string;
    browser: string;
    os: string;
  };
  ipAddress?: string;
  reviewId?: string;
  reviewRating?: number;
}

const NFCEventSchema: Schema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'NFCCard',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    eventType: {
      type: String,
      enum: ['scan', 'review_started', 'review_completed'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
      index: true
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    deviceInfo: {
      type: {
        type: String
      },
      browser: String,
      os: String
    },
    ipAddress: String,
    reviewId: String,
    reviewRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Índices compuestos para consultas comunes
NFCEventSchema.index({ cardId: 1, eventType: 1, timestamp: -1 });
NFCEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
NFCEventSchema.index({ businessId: 1, eventType: 1, timestamp: -1 });

export default mongoose.model<INFCEvent>('NFCEvent', NFCEventSchema);