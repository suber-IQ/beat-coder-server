import cloudinary from "../config/cloudinary";

export const uploadVideo = (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    folder: "lesson-videos",
  });
};

export const uploadImage = (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder: "course-thumbnails",
  });
};
