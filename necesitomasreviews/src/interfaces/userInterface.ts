// src/interfaces/userInterface.ts
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';
  region?: Types.ObjectId;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}