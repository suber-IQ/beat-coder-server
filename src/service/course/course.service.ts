import Course, { ICourse } from '../../models/course/course.schema';
import mongoose from 'mongoose';
import CustomError from '../../utils/custom.error';
import fs from 'fs';
import { uploadVideo, uploadImage } from '../../utils/cloudinary';

interface CourseData {
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  rating?: number;

  // Local file paths (from multer)
  videoPath?: string;
  thumbnailPath?: string;

  // Final Cloudinary URLs
  videoUrl?: string;
  thumbnailUrl?: string;
}

class CourseService {
  async createCourse(data: CourseData): Promise<ICourse> {
    let videoUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    // Upload intro video to Cloudinary
    if (data.videoPath) {
      const videoRes = await uploadVideo(data.videoPath);
      videoUrl = videoRes.secure_url;
      fs.unlinkSync(data.videoPath); // delete local file
    }

    // Upload thumbnail to Cloudinary
    if (data.thumbnailPath) {
      const imageRes = await uploadImage(data.thumbnailPath);
      thumbnailUrl = imageRes.secure_url;
      fs.unlinkSync(data.thumbnailPath); // delete local file
    }

    const courseData = {
      ...data,
      videoUrl,
      thumbnailUrl,
    };

    return await Course.create(courseData);
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await Course.find()
      .populate('category')
      .populate('lessons')
      .populate('instructor');
  }

  async getCourseById(id: string): Promise<ICourse> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid course ID', 400);
    }

    const course = await Course.findById(id)
      .populate('category')
      .populate('lessons')
      .populate('instructor');

    if (!course) {
      throw new CustomError('Course not found', 404);
    }

    return course;
  }

  async updateCourse(id: string, updates: Partial<CourseData>): Promise<ICourse> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid course ID', 400);
    }

    let updatedFields: Partial<CourseData> = { ...updates };

    if (updates.videoPath) {
      const videoRes = await uploadVideo(updates.videoPath);
      updatedFields.videoUrl = videoRes.secure_url;
      fs.unlinkSync(updates.videoPath);
    }

    if (updates.thumbnailPath) {
      const imageRes = await uploadImage(updates.thumbnailPath);
      updatedFields.thumbnailUrl = imageRes.secure_url;
      fs.unlinkSync(updates.thumbnailPath);
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    })
      .populate('category')
      .populate('lessons')
      .populate('instructor');

    if (!updatedCourse) {
      throw new CustomError('Course not found', 404);
    }

    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid course ID', 400);
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      throw new CustomError('Course not found', 404);
    }
  }
}

export default new CourseService();
