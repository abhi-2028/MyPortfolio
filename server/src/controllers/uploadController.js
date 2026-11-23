import multer from 'multer';

import Upload from '../models/Upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateUploadFile, uploadBuffer, deleteCloudinaryAsset } from '../services/uploadService.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    if (allowed.has(file.mimetype)) {
      callback(null, true);
    } else {
      const error = new Error('Only JPEG, PNG, WebP, and PDF files are allowed.');
      error.statusCode = 415;
      callback(error);
    }
  },
}).single('file');

const purposes = new Set(['profile', 'project', 'gallery', 'certificate', 'resume']);

export const uploadAsset = asyncHandler(async (request, response) => {
  validateUploadFile(request.file);

  const purpose = request.params.purpose || request.body.purpose;
  if (!purposes.has(purpose)) {
    const error = new Error('Invalid upload purpose.');
    error.statusCode = 400;
    throw error;
  }

  const replacementPublicId = request.body.replacementPublicId?.trim();
  const result = await uploadBuffer(request.file, purpose);

  try {
    const upload = await Upload.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      originalName: request.file.originalname,
      mimeType: request.file.mimetype,
      purpose,
    });

    if (replacementPublicId) {
      const previous = await Upload.findOne({ publicId: replacementPublicId });
      await deleteCloudinaryAsset(replacementPublicId, previous?.resourceType || 'image');
      if (previous) await previous.deleteOne();
    }

    response.status(201).json({
      success: true,
      message: 'File uploaded.',
      data: upload,
    });
  } catch (error) {
    await deleteCloudinaryAsset(result.public_id, result.resource_type);
    throw error;
  }
});

export const deleteAsset = asyncHandler(async (request, response) => {
  const upload = await Upload.findById(request.params.id);
  if (!upload) {
    const error = new Error('Upload not found.');
    error.statusCode = 404;
    throw error;
  }

  await deleteCloudinaryAsset(upload.publicId, upload.resourceType);
  await upload.deleteOne();

  response.status(200).json({
    success: true,
    message: 'File deleted.',
  });
});

export const listAssets = asyncHandler(async (request, response) => {
  const filter = {};
  if (request.query.purpose) filter.purpose = request.query.purpose;
  const uploads = await Upload.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  response.status(200).json({ success: true, data: uploads });
});
