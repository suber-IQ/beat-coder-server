// models/problem.schema.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: mongoose.Types.ObjectId[];
  constraints: string;
  createdAt: Date;
}

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  testCases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TestCase',
    },
  ],
  constraints: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
export default Problem;
