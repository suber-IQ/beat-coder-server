import express from "express";
import { isAuthenticate } from "../../middleware/is.authenticate";
import { authorizeRoles } from "../../middleware/authorize.role";
import { validateRequest } from "../../middleware/validation.middleware";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../controllers/course/user.controller";
import {
  validateUserId,
  validateUpdateUser,
} from "../../validations/course/user/user.validation";

const userRoutes = express.Router();

// Get all users (Admin only)
userRoutes.get(
  "/",
  isAuthenticate,
  authorizeRoles("admin"),
  getAllUsers
);

// Get single user by ID (Admin only)
userRoutes.get(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateRequest,
  getUserById
);

// Update user (Admin only)
userRoutes.put(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateUpdateUser,
  validateRequest,
  updateUser
);

// Delete user (Admin only)
userRoutes.delete(
  "/:id",
  isAuthenticate,
  authorizeRoles("admin"),
  validateUserId,
  validateRequest,
  deleteUser
);

export default userRoutes;
