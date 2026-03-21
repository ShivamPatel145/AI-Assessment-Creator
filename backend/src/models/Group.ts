import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  students: number;
  term: string;
  color: string;
  roster: Array<{ name: string; rollNo?: string }>;
}

const GroupSchema = new Schema<IGroup>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    students: { type: Number, default: 0 },
    term: { type: String, required: true },
    color: { type: String, default: '#e0e7ff' },
    roster: [{ name: { type: String, required: true }, rollNo: { type: String } }],
  },
  { timestamps: true }
);

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
