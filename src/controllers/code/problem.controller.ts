import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import ProblemService from '../../service/code/problem.service';

// POST /api/problems
export const createProblem = catchAsync(async (req: Request, res: Response) => {
  const { title, description, difficulty, constraints } = req.body;

  const data = { title, description, difficulty, constraints };
  const problem = await ProblemService.createProblem(data);

 return res.status(201).json({
    message: 'Problem created',
    problem,
  });
});

// GET /api/problems
export const getAllProblems = catchAsync(async (req: Request, res: Response) => {
  const problems = await ProblemService.getAllProblems();
 return res.status(200).json({problems});
});

// GET /api/problems/:slug
export const getProblemBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const problem = await ProblemService.getProblemBySlug(slug);
  // console.log(problem)
 return res.status(200).json(problem);
});

// PUT /api/problems/:slug
export const updateProblem = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const updates = req.body;

  const updated = await ProblemService.updateProblem(slug, updates);
  return res.status(200).json({
    message: 'Problem updated successfully',
    updated,
  });
});

// DELETE /api/problems/:slug
export const deleteProblem = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  await ProblemService.deleteProblem(slug);
  return res.status(200).json({ message: 'Problem deleted successfully' });
});
