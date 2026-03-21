import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryFolder extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  category: string;
}

const LibraryFolderSchema = new Schema<ILibraryFolder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, default: 'Reference' },
  },
  { timestamps: true }
);

LibraryFolderSchema.index({ user: 1, name: 1, category: 1 }, { unique: true });

export const LibraryFolder = mongoose.model<ILibraryFolder>('LibraryFolder', LibraryFolderSchema);
