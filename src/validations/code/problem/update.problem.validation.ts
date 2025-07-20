import { body,ValidationChain } from "express-validator";
import mongoose from "mongoose";

export const updateProblemValidation: ValidationChain[] = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty value'),
  body('constraints').optional().isString(),
  body('testCases')
    .optional()
    .isArray()
    .withMessage('TestCases must be an array')
    .custom((value) => {
      return value.every((id: string) => mongoose.Types.ObjectId.isValid(id));
    })
    .withMessage('Each testCase ID must be a valid ObjectId'),
];
