// models/userSubscription.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUserSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  razorpaySubscriptionId?: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled";
}

const UserSubscriptionSchema: Schema<IUserSubscription> =
  new Schema<IUserSubscription>(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
      razorpaySubscriptionId: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    },
    { timestamps: true }
  );

const UserSubscription: Model<IUserSubscription> = mongoose.model(
  "UserSubscription",
  UserSubscriptionSchema
);

export default UserSubscription;
