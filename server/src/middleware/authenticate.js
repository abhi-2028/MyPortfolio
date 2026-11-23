import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const unauthorized = (message = 'Authentication required.') => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

export const authenticate = async (request, response, next) => {
  try {
    const token = request.cookies?.portfolio_admin;
    if (!token) throw unauthorized();

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'portfolio-api',
        audience: 'portfolio-admin',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw unauthorized('Your session has expired. Please log in again.');
      }
      throw unauthorized('Invalid authentication session.');
    }

    const admin = await AdminUser.findById(payload.sub).select('+passwordHash');
    if (!admin || !admin.active) throw unauthorized('Admin account is unavailable.');

    request.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
