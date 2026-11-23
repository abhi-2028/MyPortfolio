import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    issuingOrganization: { type: String, required: true, trim: true, maxlength: 150 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialId: { type: String, trim: true, maxlength: 150 },
    credentialUrl: { type: String, trim: true, maxlength: 500 },
    image: { type: String, trim: true, maxlength: 500 },
    description: { type: String, trim: true, maxlength: 3000 },
    displayOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

certificateSchema.index({ displayOrder: 1, issueDate: -1 });

export default mongoose.model('Certificate', certificateSchema);
