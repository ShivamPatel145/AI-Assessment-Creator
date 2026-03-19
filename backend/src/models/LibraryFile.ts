import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryFile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: string;
  folder: string;
}

const LibraryFileSchema = new Schema<ILibraryFile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    folder: { type: String, default: 'Uncategorized' },
  },
  { timestamps: true }
);

export const LibraryFile = mongoose.model<ILibraryFile>('LibraryFile', LibraryFileSchema);
