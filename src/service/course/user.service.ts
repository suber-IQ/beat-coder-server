import mongoose from "mongoose";
import CustomError from "../../utils/custom.error";
import User, { Gender, IUser, UserRole } from "../../models/user/user.schema";

interface UserData {
  name?: string;
  email?: string;
  role?: UserRole;
  gender?: Gender;
  location?: string;
  birthday?: string;
  summary?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  work?: string;
  education?: string;
  skills?: string[];
}

class UserService {
  // Fetch all users
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  // Fetch a single user by ID
  async getUserById(id: string): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }

  // Update user (admin can change any field except password here)
  async updateUser(id: string, updates: Partial<UserData>): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const allowedUpdates: Partial<UserData> = { ...updates };

    const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new CustomError("User not found", 404);
    }

    return updatedUser;
  }

  // Delete a user by ID
  async deleteUser(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("User not found", 404);
    }
  }
}

export default new UserService();
