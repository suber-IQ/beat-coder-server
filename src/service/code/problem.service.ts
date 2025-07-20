import slugify from 'slugify';
import Problem, { IProblem } from '../../models/code/problem.schema';
import CustomError from '../../utils/custom.error';

interface CreateProblemInput {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  constraints?: string;
}

class ProblemService {
  async createProblem(data: CreateProblemInput): Promise<IProblem> {
    const slug = slugify(data.title, { lower: true });

    const existing = await Problem.findOne({ slug });
    if (existing) {
      throw new CustomError('Problem with this title already exists', 400);
    }

    const problem = await Problem.create({
      ...data,
      slug,
    });

    return problem;
  }

  async getAllProblems(): Promise<IProblem[]> {
    // return await Problem.find().populate('testCases;
    return await Problem.find();
  }

  async getProblemBySlug(slug: string): Promise<IProblem> {
    // const problem = await Problem.findOne({ slug }).populate('testCases');
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      throw new CustomError('Problem not found', 404);
    }
    return problem;
  }

  async updateProblem(slug: string, updates: Partial<IProblem>): Promise<IProblem> {
    // const updatedProblem = await Problem.findOneAndUpdate({ slug }, updates, { new: true }).populate('testCases');
    const updatedProblem = await Problem.findOneAndUpdate({ slug }, updates, { new: true });
    if (!updatedProblem) {
      throw new CustomError('Problem not found', 404);
    }
    return updatedProblem;
  }

  async deleteProblem(slug: string): Promise<void> {
    const result = await Problem.findOneAndDelete({ slug });
    if (!result) {
      throw new CustomError('Problem not found', 404);
    }
  }
}

export default new ProblemService();
