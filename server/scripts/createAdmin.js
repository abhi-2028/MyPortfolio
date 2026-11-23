import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import AdminUser from '../src/models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env with override: true so that session variables do not hijack it
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before running create-admin.');
  }
  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 12);

  // If replacing a placeholder or test account like owner@example.com
  if (email !== 'owner@example.com') {
    await AdminUser.deleteMany({ email: 'owner@example.com' });
  }

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.active = true;
    await existing.save();
    console.log(`Admin account updated successfully for ${email}.`);
  } else {
    await AdminUser.create({
      name: 'Portfolio Admin',
      email,
      passwordHash,
      role: 'owner',
      active: true,
    });
    console.log(`Admin account created successfully for ${email}.`);
  }
};

createAdmin()
  .finally(disconnectDatabase)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

