// models/submission.schema.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Pending';
  output?: string;
  error?: string;
  createdAt: Date;
  executionTime?: number; // in ms
}

const SubmissionSchema = new Schema<ISubmission>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error', 'Pending'],
    default: 'Pending',
  },
  output: { type: String },
  error: { type: String },
  executionTime: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
