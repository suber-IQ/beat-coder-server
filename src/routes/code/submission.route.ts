import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { validateRequest } from '../../middleware/validation.middleware';
import { createSubmissionValidation } from '../../validations/code/submission/create.submission.validation';
import {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
  runCode,
} from '../../controllers/code/submission.controller';

const submissionRoutes = express.Router();

submissionRoutes.post(
  '/submit',
  isAuthenticate,
  createSubmissionValidation,
  validateRequest,
  createSubmission
);

submissionRoutes.post(
  "/run",
  isAuthenticate,
  createSubmissionValidation, 
  validateRequest,
  runCode
);

submissionRoutes.get('/me', isAuthenticate, getMySubmissions);
submissionRoutes.get('/:id', isAuthenticate, getSubmissionById);

export default submissionRoutes;
