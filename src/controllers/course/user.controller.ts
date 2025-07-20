import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import UserService from "../../service/course/user.service";

// GET all users (Admin only)
export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({ users });
});

// GET a single user by ID
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id);
  res.status(200).json({ user });
});

// UPDATE a user (Admin can update name, role, profile fields)
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: "User updated successfully", user: updatedUser });
});

// DELETE a user
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});
