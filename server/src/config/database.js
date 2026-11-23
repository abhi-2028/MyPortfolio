import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS || 5000),
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
