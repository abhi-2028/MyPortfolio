import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

import { login, logout, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { verifyCsrf, issueCsrfToken } from '../middleware/csrf.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Try again later.',
  },
});

router.get('/csrf', issueCsrfToken);

router.post(
  '/login',
  loginLimiter,
  [
    body('email').trim().isEmail().normalizeEmail().isLength({ max: 254 }),
    body('password').isString().isLength({ min: 12, max: 128 }),
  ],
  validateRequest,
  verifyCsrf,
  login,
);

router.post('/logout', verifyCsrf, logout);
router.get('/me', authenticate, me);

export default router;
