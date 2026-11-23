import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, trim: true, maxlength: 500, index: true },
    url: { type: String, required: true, trim: true, maxlength: 1000 },
    secureUrl: { type: String, required: true, trim: true, maxlength: 1000 },
    resourceType: { type: String, enum: ['image', 'raw', 'video'], required: true },
    format: { type: String, trim: true, maxlength: 20 },
    bytes: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    originalName: { type: String, trim: true, maxlength: 255 },
    mimeType: { type: String, trim: true, maxlength: 100 },
    purpose: {
      type: String,
      enum: ['profile', 'project', 'gallery', 'certificate', 'resume'],
      required: true,
    },
  },
  { timestamps: true },
);

uploadSchema.index({ purpose: 1, createdAt: -1 });

export default mongoose.model('Upload', uploadSchema);
