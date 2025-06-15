import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

export interface IUser extends Document {
  email: string;
  password: string;
  role?: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 12,
    },
    role: {
      type: String,
      enum: ['user', 'host'],
      default: 'user',
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 11);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error(
      'ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY environment variable is not set'
    );
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY),
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error(
      'REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY environment variable is not set'
    );
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY),
    }
  );
};

const User = model<IUser>('User', userSchema);
export default User;
