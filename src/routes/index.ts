import express from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './user/user.route';
import problemRoutes from './code/problem.route';
import testCaseRoutes from './code/testcase.route';
import submissionRoutes from './code/submission.route';
import courseRoutes from './course/course.route';
import lessonRoutes from './course/lesson.route';
import categoryRoutes from './course/category.route';
import enrollmentRoutes from './course/enrollement.route';
import reviewRoutes from './course/review.route';
import progressRoutes from './course/progress.route';
import quizRoutes from './course/quiz.route';
import certificateRoutes from './course/certificate.route';
import instructorRoutes from './course/instructor.route';
import analyticsRoutes from './analyatics/analyatic.route';

import adminUserRoutes from './course/user.route';
import subscriptionRoutes from './subscription/subscription.route';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/problems', problemRoutes);
routes.use('/testcase', testCaseRoutes);
routes.use('/submission', submissionRoutes);

// course
routes.use('/course',courseRoutes)
routes.use('/lesson',lessonRoutes)
routes.use('/category',categoryRoutes)
routes.use('/enrollement',enrollmentRoutes)
routes.use('/review',reviewRoutes)
routes.use('/progress',progressRoutes)
routes.use('/quiz',quizRoutes)
routes.use('/certificate',certificateRoutes)
routes.use('/instructor',instructorRoutes)

routes.use('/analyatic',analyticsRoutes)
routes.use('/admin/user',adminUserRoutes)

routes.use('/subscription',subscriptionRoutes)


export default routes;
