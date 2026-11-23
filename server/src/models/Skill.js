import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    category: { type: String, trim: true, maxlength: 80 },
    proficiency: { type: Number, min: 0, max: 100 },
    icon: { type: String, trim: true, maxlength: 500 },
    displayOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

skillSchema.index({ name: 1 });
skillSchema.index({ category: 1, displayOrder: 1 });

export default mongoose.model('Skill', skillSchema);
