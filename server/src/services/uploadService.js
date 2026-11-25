import https from 'node:https';
import { Readable } from 'node:stream';

import { configureCloudinary } from '../config/cloudinary.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const DEFAULT_UPLOAD_TIMEOUT_MS = Number(process.env.CLOUDINARY_UPLOAD_TIMEOUT_MS || 180000);
const MAX_UPLOAD_ATTEMPTS = 2;

const cloudinaryAgent = new https.Agent({
  keepAlive: true,
  family: 4,
  timeout: DEFAULT_UPLOAD_TIMEOUT_MS,
});

const isTransientUploadError = (error) => {
  if (!error) return false;
  const code = error.code || error.errno;
  return (
    error.http_code === 499
    || error.name === 'TimeoutError'
    || code === 'ETIMEDOUT'
    || code === 'ECONNRESET'
    || code === 'EPIPE'
    || code === 'EAI_AGAIN'
  );
};

const wrapCloudinaryError = (error) => {
  const detail = error?.message || 'Upload failed.';
  if (error?.http_code === 403) {
    const forbiddenError = new Error(
      "Cloudinary upload forbidden (403): Your API key lacks 'create' permissions for product environment. Please verify your Access Keys permissions in Cloudinary Console.",
    );
    forbiddenError.statusCode = 403;
    forbiddenError.originalError = error;
    return forbiddenError;
  }

  const isTimeout =
    error?.http_code === 499 || error?.name === 'TimeoutError' || error?.code === 'ETIMEDOUT';
  const wrappedError = new Error(
    isTimeout
      ? 'Cloudinary upload timed out. Please try a smaller image or check your internet upload speed.'
      : `Cloudinary upload error: ${detail}`,
  );
  wrappedError.statusCode = isTimeout ? 504 : 502;
  wrappedError.originalError = error;
  return wrappedError;
};

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

const uploadBufferOnce = (file, purpose) =>
  new Promise((resolve, reject) => {
    const cloudinary = configureCloudinary();
    const resourceType = file.mimetype === 'application/pdf' ? 'auto' : 'image';
    let settled = false;

    const finishError = (rawError) => {
      if (settled) return;
      settled = true;
      reject(rawError);
    };

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${purpose}`,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        timeout: DEFAULT_UPLOAD_TIMEOUT_MS,
        agent: cloudinaryAgent,
      },
      (error, result) => {
        if (error) {
          finishError(error);
          return;
        }
        if (settled) return;
        settled = true;
        resolve(result);
      },
    );

    stream.on('error', finishError);

    const readable = Readable.from(file.buffer);
    readable.on('error', finishError);
    readable.pipe(stream);
  });

export const uploadBuffer = async (file, purpose) => {
  let lastError;
  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      return await uploadBufferOnce(file, purpose);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_UPLOAD_ATTEMPTS && isTransientUploadError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      throw wrapCloudinaryError(error);
    }
  }
  throw wrapCloudinaryError(lastError);
};

export const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
  const cloudinary = configureCloudinary();
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
      timeout: DEFAULT_UPLOAD_TIMEOUT_MS,
      agent: cloudinaryAgent,
    });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error.message);
  }
};
