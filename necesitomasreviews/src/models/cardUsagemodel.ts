import mongoose, { Document, Schema } from 'mongoose';

export interface ICardUsage extends Document {
  cardId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  browser: string;
  device: string;
  os: string;
  ip: string;
}

const cardUsageSchema = new Schema<ICardUsage>(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'NfcCard',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    os: {
      type: String,
    },
    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CardUsage = mongoose.model<ICardUsage>('CardUsage', cardUsageSchema);

export default CardUsage;