import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryFile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: string;
  folder: string;
  folderId?: mongoose.Types.ObjectId;
  fileUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  storageKey?: string;
}

const LibraryFileSchema = new Schema<ILibraryFile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    folder: { type: String, default: 'Uncategorized' },
    folderId: { type: Schema.Types.ObjectId, ref: 'LibraryFolder' },
    fileUrl: { type: String },
    mimeType: { type: String },
    sizeBytes: { type: Number },
    storageKey: { type: String },
  },
  { timestamps: true }
);

export const LibraryFile = mongoose.model<ILibraryFile>('LibraryFile', LibraryFileSchema);
