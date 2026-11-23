import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const cookieName = 'portfolio_admin';

const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 60 * 1000,
});

export const login = asyncHandler(async (request, response) => {
  const email = request.body.email.trim().toLowerCase();
  const password = request.body.password;

  const admin = await AdminUser.findOne({ email, active: true }).select('+passwordHash');
  if (!admin) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await admin.verifyPassword(password);
  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m', issuer: 'portfolio-api', audience: 'portfolio-admin' },
  );

  response.cookie(cookieName, token, authCookieOptions());
  response.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
});

export const logout = asyncHandler(async (request, response) => {
  response.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  response.status(200).json({
    success: true,
    message: 'Logout successful.',
  });
});

export const me = asyncHandler(async (request, response) => {
  response.status(200).json({
    success: true,
    data: {
      admin: {
        id: request.admin._id,
        name: request.admin.name,
        email: request.admin.email,
        role: request.admin.role,
      },
    },
  });
});
