import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 150 },
    degree: { type: String, trim: true, maxlength: 150 },
    fieldOfStudy: { type: String, trim: true, maxlength: 150 },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, trim: true, maxlength: 3000 },
    displayOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

educationSchema.index({ displayOrder: 1, startDate: -1 });

export default mongoose.model('Education', educationSchema);
