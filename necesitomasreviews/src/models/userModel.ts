import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Por favor ingrese su nombre'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Por favor ingrese su correo electrónico'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un correo electrónico válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor ingrese una contraseña'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: ['USER', 'PROMOTER', 'REGIONAL_ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Middleware para cifrar la contraseña antes de guardarla
userSchema.pre<IUser>('save', async function (next) {
  // Solo cifrar la contraseña si ha sido modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(10);
    // Cifrar la contraseña con el salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);