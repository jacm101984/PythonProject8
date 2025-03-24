// Ejemplo de modelo para tarjetas NFC (src/models/nfcCardModel.ts)
import mongoose, { Document, Schema } from 'mongoose';

export interface INFCCard extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  googleLink: string;
  totalScans: number;
  totalReviews: number;
  lastScan: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const NFCCardSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  googleLink: {
    type: String,
    required: true,
    trim: true
  },
  totalScans: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  lastScan: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<INFCCard>('NFCCard', NFCCardSchema);