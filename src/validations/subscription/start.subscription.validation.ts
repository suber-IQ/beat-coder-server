import { body } from "express-validator";

export const startSubscriptionValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("planId")
    .notEmpty()
    .withMessage("Plan ID is required")
    .isMongoId()
    .withMessage("Invalid Plan ID"),
];
