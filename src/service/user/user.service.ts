import User, { IUser } from '../../models/user/user.schema';
import CustomError from '../../utils/custom.error';
import { sanitizeUser } from '../../utils/sanitize.user';

class UserService {

async updateProfile(userId: string, updateData: Partial<IUser>): Promise<Partial<IUser>> {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  // ✅ Gender validation (PascalCase)
  if (
    updateData.gender &&
    !["male", "female", "other"].includes(updateData.gender)
  ) {
    throw new CustomError("Invalid gender value. Allowed: Male, Female, Other", 400);
  }

  // ✅ Apply only allowed fields
  const allowedFields: (keyof IUser)[] = [
    "name", "email", "gender", "location", "birthday", "summary",
    "website", "github", "linkedin", "twitter", "work", "education", "skills"
  ];

  allowedFields.forEach((key) => {
    if (updateData[key] !== undefined) {
      (user as any)[key] = updateData[key];
    }
  });

  await user.save();

  return sanitizeUser(user);
}



  async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await User.findByIdAndDelete(userId);
  }
}

export default new UserService();
