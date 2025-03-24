import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el documento de PromoCode
export interface PromoCodeDocument extends Document {
  code: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
  promoterId: mongoose.Types.ObjectId | null;
  description: string;
}

// Esquema principal de PromoCode
const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      default: null
    },
    maxUses: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    promoterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Método para verificar si un código promocional es válido
PromoCodeSchema.methods.isValid = function(): boolean {
  // Verificar si está activo
  if (!this.isActive) return false;

  // Verificar si ha expirado
  if (this.expiresAt && new Date() > this.expiresAt) return false;

  // Verificar si se ha alcanzado el límite de usos
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;

  return true;
};

// Índices para mejorar el rendimiento de las consultas
PromoCodeSchema.index({ code: 1 }, { unique: true });
PromoCodeSchema.index({ promoterId: 1 });
PromoCodeSchema.index({ isActive: 1, expiresAt: 1 });

export const PromoCode = mongoose.model<PromoCodeDocument>('PromoCode', PromoCodeSchema);