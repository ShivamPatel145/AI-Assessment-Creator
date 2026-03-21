import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  schoolName: string;
  location: string;
  avatarUrl?: string;
  role: 'TEACHER' | 'STUDENT';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  schoolName: { type: String, required: true },
  location: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['TEACHER', 'STUDENT'], default: 'TEACHER' }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
