import express from "express";
import { isAuthenticate } from "../../middleware/is.authenticate";
import { authorizeRoles } from "../../middleware/authorize.role";
import { validateRequest } from "../../middleware/validation.middleware";

// Subscription controllers
import {
  createPlan,
  getAllPlans,
  startSubscription,
  cancelSubscription,
  checkUserSubscription,
  verifyRazorpayWebhook,
} from "../../controllers/subscription/subscription.controller";
import { createPlanValidation } from "../../validations/subscription/create.plan.validation";
import { startSubscriptionValidation } from "../../validations/subscription/start.subscription.validation";
import { cancelSubscriptionValidation } from "../../validations/subscription/cancel.subscription.validation";


const subscriptionRoutes = express.Router();

/**
 * Admin creates a new subscription plan
 */
subscriptionRoutes.post(
  "/plans",
  isAuthenticate,
  authorizeRoles("admin"),
  createPlanValidation,
  validateRequest,
  createPlan
);

/**
 * Fetch all subscription plans (public)
 */
subscriptionRoutes.get("/plans", getAllPlans);

/**
 * Start a subscription for a user (Authenticated user)
 */
subscriptionRoutes.post(
  "/start",
  isAuthenticate,
  startSubscriptionValidation,
  validateRequest,
  startSubscription
);

/**
 * Cancel a subscription (Authenticated user)
 */
subscriptionRoutes.post(
  "/cancel",
  isAuthenticate,
  cancelSubscriptionValidation,
  validateRequest,
  cancelSubscription
);

/**
 * Check if a user has an active subscription (Authenticated user)
 */
subscriptionRoutes.get(
  "/check/:userId",
  isAuthenticate,
  checkUserSubscription
);

/** Razorpay Webhook (no auth) */
subscriptionRoutes.post(
  "/webhook",
  express.json({ type: "application/json" }),
  verifyRazorpayWebhook
);


export default subscriptionRoutes;
