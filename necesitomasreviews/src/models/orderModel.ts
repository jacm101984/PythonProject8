import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  packageType: string;
  cardQuantity: number;
  totalAmount: number;
  currency: string;
  status: string;
  promoCode?: string;
  promoterId?: mongoose.Types.ObjectId;
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageType: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'business'],
      required: true,
    },
    cardQuantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    promoCode: {
      type: String,
    },
    promoterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;