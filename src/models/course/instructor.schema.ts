import mongoose, { Schema, Document } from "mongoose";

export interface IInstructor extends Document {
  user: mongoose.Types.ObjectId;
  bio: string;
  expertise: string[];
}

const instructorSchema = new Schema<IInstructor>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    bio: { type: String },
    expertise: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IInstructor>("Instructor", instructorSchema);
