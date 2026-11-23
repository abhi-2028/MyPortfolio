import { configureCloudinary } from '../config/cloudinary.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

export const validateUploadFile = (file) => {
  if (!file) {
    const error = new Error('A file is required.');
    error.statusCode = 400;
    throw error;
  }
  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error('Only JPEG, PNG, WebP, and PDF files are allowed.');
    error.statusCode = 415;
    throw error;
  }
};

export const uploadBuffer = (file, purpose) =>
  new Promise((resolve, reject) => {
    const cloudinary = configureCloudinary();
    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${purpose}`,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          error.statusCode = 502;
          reject(error);
          return;
        }
        resolve(result);
      },
    );
    stream.end(file.buffer);
  });

export const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
  const cloudinary = configureCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
};
