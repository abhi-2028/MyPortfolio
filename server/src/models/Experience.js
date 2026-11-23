import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 150 },
    position: { type: String, required: true, trim: true, maxlength: 150 },
    employmentType: { type: String, trim: true, maxlength: 50 },
    location: { type: String, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 3000 },
    responsibilities: [{ type: String, trim: true, maxlength: 500 }],
    technologies: [{ type: String, trim: true, maxlength: 80 }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ displayOrder: 1, startDate: -1 });

export default mongoose.model('Experience', experienceSchema);
