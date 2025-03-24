// Modelo para escaneos (src/models/scanModel.ts)
import mongoose, { Document, Schema } from 'mongoose';

export interface IScan extends Document {
  card: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

const ScanSchema: Schema = new Schema({
  card: {
    type: Schema.Types.ObjectId,
    ref: 'NFCCard',
    required: true
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IScan>('Scan', ScanSchema);