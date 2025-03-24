import mongoose, { Document, Schema } from 'mongoose';

export interface IRegion extends Document {
  name: string;
  code: string;
  createdBy: mongoose.Types.ObjectId;
}

const regionSchema = new Schema<IRegion>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Region = mongoose.model<IRegion>('Region', regionSchema);

export default Region;