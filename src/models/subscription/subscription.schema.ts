// models/subscriptionPlan.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string; // e.g., "Monthly", "Yearly"
  price: number; // in INR paise (e.g., 3500 = ₹35)
  interval: "month" | "year";
  description?: string;
  razorpayPlanId?: string; // From Razorpay
  createdAt: Date;
}

const SubscriptionPlanSchema: Schema<ISubscriptionPlan> =
  new Schema<ISubscriptionPlan>(
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      interval: { type: String, enum: ["month", "year"], required: true },
      description: { type: String },
      razorpayPlanId: { type: String }, // Save plan ID from Razorpay
    },
    { timestamps: true }
  );

const Subscription: Model<ISubscriptionPlan> = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);

export default Subscription;
