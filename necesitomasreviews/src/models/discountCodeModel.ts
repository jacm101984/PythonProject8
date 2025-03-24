import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscountCode extends Document {
  code: string;
  promoterId: mongoose.Types.ObjectId;
  discountPercentage: number;
  isActive: boolean;
  usageCount: number;
}

const discountCodeSchema = new Schema<IDiscountCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    promoterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DiscountCode = mongoose.model<IDiscountCode>('DiscountCode', discountCodeSchema);

export default DiscountCode;