import { Request, Response } from "express";
import crypto from "crypto";
import catchAsync from "../../utils/catch.async";
import SubscriptionService from "../../service/subscription/subscription.service";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

/**
 * Admin creates a new subscription plan
 */
export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const { name, price, interval, description } = req.body;

  const plan = await SubscriptionService.createSubscriptionPlan(
    name,
    price,
    interval,
    description
  );

  res.status(201).json({ message: "Subscription plan created successfully", plan });
});

/**
 * Fetch all subscription plans
 */
export const getAllPlans = catchAsync(async (_req: Request, res: Response) => {
  const plans = await SubscriptionService.getAllPlans();
  res.status(200).json({ plans });
});

/**
 * Start a subscription for a user
 */
export const startSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId, planId } = req.body;

  const subscription = await SubscriptionService.startUserSubscription(userId, planId);
  res.status(201).json({
    message: "Subscription started successfully",
    subscription,
  });
});

/**
 * Cancel an active subscription
 */
export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { razorpaySubscriptionId } = req.body;

  const subscription = await SubscriptionService.cancelUserSubscription(razorpaySubscriptionId);
  res.status(200).json({ message: "Subscription cancelled successfully", subscription });
});

/**
 * Check if a user has an active subscription
 */
export const checkUserSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const isSubscribed = await SubscriptionService.isUserSubscribed(userId);
  res.status(200).json({ isSubscribed });
});

/**
 * Verify Razorpay Webhook
 * - Validates signature
 * - Updates subscription status (active, cancelled, expired)
 */
export const verifyRazorpayWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
  }

  // Pass event to SubscriptionService for processing
  await SubscriptionService.verifyRazorpayWebhook(req.body, signature);

  res.status(200).json({ success: true });
});
