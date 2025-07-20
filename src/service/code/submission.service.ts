import Submission, { ISubmission } from '../../models/code/submission.schema';
import Problem from '../../models/code/problem.schema';
import CustomError from '../../utils/custom.error';
import mongoose from 'mongoose';

interface CreateSubmissionInput {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  code: string;
  language: string;
}

class SubmissionService {
  async createSubmission(data: CreateSubmissionInput): Promise<ISubmission> {
    const problemExists = await Problem.findById(data.problem);
    if (!problemExists) {
      throw new CustomError('Problem not found', 404);
    }

    const submission = await Submission.create({
      ...data,
      status: 'Pending',
    });

    return submission;
  }

  async updateSubmissionResult(
    id: string,
    result: Partial<Pick<ISubmission, 'status' | 'output' | 'error' | 'executionTime'>>
  ): Promise<ISubmission> {
    const updated = await Submission.findByIdAndUpdate(id, result, { new: true });
    if (!updated) {
      throw new CustomError('Submission not found to update', 404);
    }
    return updated;
  }

  async getUserSubmissions(userId: string) {
    return Submission.find({ user: userId }).populate('problem');
  }

  async getSubmissionById(id: string) {
    const submission = await Submission.findById(id).populate('user').populate('problem');
    if (!submission) {
      throw new CustomError('Submission not found', 404);
    }
    return submission;
  }
}

export default new SubmissionService();
