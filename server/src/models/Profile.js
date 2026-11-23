import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    headline: { type: String, trim: true, maxlength: 300 },
    bio: { type: String, trim: true, maxlength: 5000 },
    profileImage: { type: String, trim: true, maxlength: 500 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    location: { type: String, trim: true, maxlength: 150 },
    socialLinks: {
      linkedIn: { type: String, trim: true, maxlength: 500 },
      github: { type: String, trim: true, maxlength: 500 },
      twitter: { type: String, trim: true, maxlength: 500 },
      website: { type: String, trim: true, maxlength: 500 },
    },
    resumeUrl: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

export default mongoose.model('Profile', profileSchema);
