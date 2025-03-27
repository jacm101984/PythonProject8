// src/models/notification.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  cardId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  eventType: 'scan' | 'review_completed';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  timestamp: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'NFCCard',
      required: true
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    eventType: {
      type: String,
      enum: ['scan', 'review_completed'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Índices para consultas comunes
NotificationSchema.index({ userId: 1, read: 1, timestamp: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);