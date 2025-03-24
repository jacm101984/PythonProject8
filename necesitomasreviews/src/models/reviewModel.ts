// Modelo para reseñas (src/models/reviewModel.ts)
import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  card: mongoose.Types.ObjectId;
  reviewId: string; // ID de la reseña en Google (si está disponible)
  rating: number;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  card: {
    type: Schema.Types.ObjectId,
    ref: 'NFCCard',
    required: true
  },
  reviewId: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  }
}, {
  timestamps: true
});

export default mongoose.model<IReview>('Review', ReviewSchema);