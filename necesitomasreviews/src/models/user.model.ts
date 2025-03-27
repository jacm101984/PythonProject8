// src/models/user.model.ts

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  region: mongoose.Types.ObjectId | null;
  subscriptionId: mongoose.Types.ObjectId | null;
  fcmTokens: string[]; // Firebase Cloud Messaging tokens para notificaciones push
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    dailyReports: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['USER', 'PROMOTER', 'REGIONAL_ADMIN', 'SUPER_ADMIN'],
      default: 'USER'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    verificationToken: {
      type: String,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    region: {
      type: Schema.Types.ObjectId,
      ref: 'Region',
      default: null
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    },
    fcmTokens: {
      type: [String],
      default: []
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      dailyReports: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook para hashear contraseñas
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);