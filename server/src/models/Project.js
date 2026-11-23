import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 500 },
    detailedDescription: { type: String, trim: true, maxlength: 5000 },
    technologies: [{ type: String, trim: true, maxlength: 80 }],
    image: { type: String, trim: true, maxlength: 500 },
    gallery: [{ type: String, trim: true, maxlength: 500 }],
    githubUrl: { type: String, trim: true, maxlength: 500 },
    liveUrl: { type: String, trim: true, maxlength: 500 },
    category: { type: String, trim: true, maxlength: 80 },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ featured: -1, displayOrder: 1, title: 1 });
projectSchema.index({ category: 1, displayOrder: 1 });

projectSchema.pre('validate', async function generateUniqueSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }

  if (!this.slug) return;

  const baseSlug = slugify(this.slug);
  let candidate = baseSlug;
  let suffix = 2;

  while (await mongoose.model('Project').exists({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  this.slug = candidate;
});

export default mongoose.model('Project', projectSchema);
