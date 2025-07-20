// routes/course/lessonRoutes.ts
import express from 'express';

import {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} from '../../controllers/course/lesson.controller';

import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { validateRequest } from '../../middleware/validation.middleware';

import { createLessonValidation } from '../../validations/course/lesson/create.lesson.validation';
import { updateLessonValidation } from '../../validations/course/lesson/update.lesson.validation';
import { deleteLessonValidation } from '../../validations/course/lesson/delete.lesson.validation';
import upload from '../../middleware/multer.middleware';

const lessonRoutes = express.Router();

// 🟢 Public
lessonRoutes.get('/', getAllLessons);
lessonRoutes.get('/:id', getLessonById);

// 🔐 Admin only
lessonRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  upload.single('video'), // 👈 multer handles video upload
  createLessonValidation,
  validateRequest,
  createLesson
);

lessonRoutes.put(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  upload.single('video'), // 👈 also handle video update
  updateLessonValidation,
  validateRequest,
  updateLesson
);

lessonRoutes.delete(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  deleteLessonValidation,
  validateRequest,
  deleteLesson
);

export default lessonRoutes;
