import mongoose from "mongoose";
import crypto from "crypto";
import CustomError from "../../utils/custom.error";
import razorpay from "../../config/razorpay";
import SubscriptionPlan, { ISubscriptionPlan } from "../../models/subscription/subscription.schema";
import UserSubscription, { IUserSubscription } from "../../models/subscription/user.subscription.schema";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

class SubscriptionService {
  /**
   * Admin creates a new subscription plan (Razorpay + MongoDB).
   */
  async createSubscriptionPlan(
    name: string,
    price: number, // in paise (₹100 = 10000)
    interval: "month" | "year",
    description?: string
  ): Promise<ISubscriptionPlan> {
    const existing = await SubscriptionPlan.findOne({ name });
    if (existing) {
      throw new CustomError("A subscription plan with this name already exists", 409);
    }

    const period = interval === "month" ? "monthly" : "yearly";

    const razorpayPlan = await razorpay.plans.create({
      period,
      interval: 1,
      item: { name, amount: price, currency: "INR" },
    });

    return await SubscriptionPlan.create({
      name,
      price,
      interval,
      description,
      razorpayPlanId: razorpayPlan.id,
    });
  }

  /** Get all plans for frontend */
  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find();
  }

  /**
   * Start a subscription for a user.
   */
  async startUserSubscription(userId: string, planId: string): Promise<IUserSubscription> {
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      throw new CustomError("Invalid plan ID", 400);
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.razorpayPlanId) {
      throw new CustomError("Subscription plan not found", 404);
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      customer_notify: 1,
      total_count: plan.interval === "month" ? 1 : 12, // monthly = 1 cycle, yearly = 12 cycles
    });

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (plan.interval === "month" ? 30 : 365) * 24 * 60 * 60 * 1000
    );

    return await UserSubscription.create({
      userId,
      planId,
      razorpaySubscriptionId: subscription.id,
      startDate,
      endDate,
      status: "pending", // Initially pending until webhook confirms activation
    });
  }

  /** Cancel an active subscription */
  async cancelUserSubscription(subscriptionId: string): Promise<IUserSubscription> {
    const subscription = await UserSubscription.findOne({
      razorpaySubscriptionId: subscriptionId,
      status: "active",
    });
    if (!subscription) throw new CustomError("Active subscription not found", 404);

    await razorpay.subscriptions.cancel(subscriptionId);
    subscription.status = "cancelled";
    await subscription.save();

    return subscription;
  }

  /** Check if user has an active subscription */
  async isUserSubscribed(userId: string): Promise<boolean> {
    const activeSub = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gte: new Date() },
    });
    return !!activeSub;
  }

  /**
   * Verify Razorpay Webhook Signature and Update Subscription Status.
   */
  async verifyRazorpayWebhook(payload: any, signature: string): Promise<void> {
    // Verify the signature using the secret
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new CustomError("Invalid Razorpay signature", 400);
    }

    const event = payload.event;
    const subscriptionId =
      payload.payload?.subscription?.entity?.id ||
      payload.payload?.payment?.entity?.subscription_id;

    if (!subscriptionId) {
      throw new CustomError("Invalid webhook payload", 400);
    }

    // Handle events from Razorpay
    if (event === "subscription.activated") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "active" },
        { new: true }
      );
    }

    if (event === "subscription.cancelled") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "cancelled" },
        { new: true }
      );
    }

    if (event === "payment.failed") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "expired" },
        { new: true }
      );
    }
  }
}

export default new SubscriptionService();
