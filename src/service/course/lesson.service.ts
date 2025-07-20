import mongoose from 'mongoose';
import fs from 'fs/promises'; // ✅ Use async version
import Lesson, { ILesson } from '../../models/course/lesson.schema';
import CustomError from '../../utils/custom.error';
import { uploadVideo } from '../../utils/cloudinary';

interface LessonData {
  title?: string;
  content?: string;
  videoPath?: string; // Temporary local path from multer
  videoUrl?: string;  // Final URL from Cloudinary
  videoDescription?: string;
  videoDuration?: number;
  videoType?: 'mp4' | 'youtube' | 'vimeo';
  transcript?: string;
  resources?: string[];
  isFreePreview?: boolean;
  course?: mongoose.Types.ObjectId;
  order?: number;
}

class LessonService {
  async createLesson(data: LessonData): Promise<ILesson> {
    let videoUrl: string | undefined;

    if (data.videoPath) {
      try {
        const uploadResult = await uploadVideo(data.videoPath);
        videoUrl = uploadResult.secure_url;
        await fs.unlink(data.videoPath);
      } catch (error) {
        throw new CustomError('Failed to upload video or clean up local file', 500);
      }
    }

    const lessonData: Partial<LessonData> = {
      ...data,
      videoUrl,
    };

    return await Lesson.create(lessonData);
  }

  async getAllLessons(): Promise<ILesson[]> {
    return await Lesson.find().populate('course');
  }

  async getLessonById(id: string): Promise<ILesson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid lesson ID', 400);
    }

    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) {
      throw new CustomError('Lesson not found', 404);
    }

    return lesson;
  }

  async updateLesson(id: string, updates: Partial<LessonData>): Promise<ILesson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid lesson ID', 400);
    }

    const updateData: Partial<LessonData> = { ...updates };

    if (updates.videoPath) {
      try {
        const uploadResult = await uploadVideo(updates.videoPath);
        updateData.videoUrl = uploadResult.secure_url;
        await fs.unlink(updates.videoPath); // ✅ Safe delete
        console.log('Updated and deleted old local file:', updates.videoPath);
      } catch (error) {
        console.error('Error during video upload or cleanup:', error);
        throw new CustomError('Failed to upload new video or clean up local file', 500);
      }
    }

    const updated = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('course');

    if (!updated) {
      throw new CustomError('Lesson not found', 404);
    }

    return updated;
  }

  async deleteLesson(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid lesson ID', 400);
    }

    const deleted = await Lesson.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError('Lesson not found', 404);
    }
  }
}

export default new LessonService();
