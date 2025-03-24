import mongoose, { Document, Schema } from 'mongoose';

// Enum para los estados de la orden
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Interfaz para la información de envío
export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

// Interfaz para los detalles de pago
export interface PaymentDetails {
  method: string;
  externalId?: string;
  transactionId?: string;
}

// Interfaz para el documento de Order
export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  planId: string;
  planName: string;
  cardCount: number;
  originalAmount: number;
  discountPercentage: number;
  discountCode: string | null;
  totalAmount: number;
  promoterId: mongoose.Types.ObjectId | null;
  paymentMethod: string;
  status: OrderStatus;
  shippingInfo: ShippingInfo;
  paymentDetails: PaymentDetails;
  cards: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Esquema para la información de envío
const ShippingInfoSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

// Esquema para los detalles de pago
const PaymentDetailsSchema = new Schema({
  method: { type: String, required: true },
  externalId: { type: String },
  transactionId: { type: String }
});

// Esquema principal de Order
const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    cardCount: { type: Number, required: true },
    originalAmount: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    discountCode: { type: String, default: null },
    totalAmount: { type: Number, required: true },
    promoterId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    paymentDetails: { type: PaymentDetailsSchema, required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: 'NfcCard' }]
  },
  { timestamps: true }
);

// Índices para mejorar el rendimiento de las consultas
OrderSchema.index({ userId: 1 });
OrderSchema.index({ promoterId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema);