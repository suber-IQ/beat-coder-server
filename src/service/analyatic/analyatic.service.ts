import Course from "../../models/course/course.schema";
import Lesson from "../../models/course/lesson.schema";
import Enrollment from "../../models/course/enrollment.schema";
import Review from "../../models/course/review.schema";
import Progress from "../../models/course/progress.schema";
import Category from "../../models/course/category.schema";
import Quiz from "../../models/course/quiz.schema";
import Certificate from "../../models/course/certificate.schema";
import Instructor from "../../models/course/instructor.schema";
import User from "../../models/user/user.schema";
import CustomError from "../../utils/custom.error";
import UserSubscription from "../../models/subscription/user.subscription.schema";

class AnalyticsService {
  getMonthlyRevenue: any;
  /**
   * Get total counts for dashboard cards and stats
   */
  async getOverview() {
    try {
      const [
        totalCourses,
        totalLessons,
        totalEnrollments,
        totalReviews,
        totalProgress,
        totalCategories,
        totalQuizzes,
        totalCertificates,
        totalInstructors,
        totalUsers,
        activeSubscribers,
      ] = await Promise.all([
        Course.countDocuments(),
        Lesson.countDocuments(),
        Enrollment.countDocuments(),
        Review.countDocuments(),
        Progress.countDocuments(),
        Category.countDocuments(),
        Quiz.countDocuments(),
        Certificate.countDocuments(),
        Instructor.countDocuments(),
        User.countDocuments(),
        UserSubscription.countDocuments({ status: "active" }),
      ]);

      return {
        totalCourses,
        totalLessons,
        totalEnrollments,
        totalReviews,
        totalProgress,
        totalCategories,
        totalQuizzes,
        totalCertificates,
        totalInstructors,
        totalUsers,
        activeSubscribers,
      };
    } catch (error: any) {
      throw new CustomError(error.message || "Failed to fetch analytics data", 500);
    }
  }

  /**
   * Get monthly active subscriptions count (for line/bar charts)
   */
  async getMonthlySubscriptions(year: number) {
    try {
      const monthlySubscriptions = await UserSubscription.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: 1 }, // count subscriptions
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      return monthlySubscriptions.map((month) => ({
        month: month._id,
        total: month.total,
      }));
    } catch (error: any) {
      throw new CustomError(error.message || "Failed to fetch monthly subscriptions", 500);
    }
  }
}

export default new AnalyticsService();
