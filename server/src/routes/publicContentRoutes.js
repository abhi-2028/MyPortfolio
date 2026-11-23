import express from 'express';
import { param, query } from 'express-validator';

import {
  getProjects,
  getProjectBySlug,
  getExperience,
  getCertificates,
  getSkills,
  getEducation,
  getProfile,
} from '../controllers/publicContentController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

router.get(
  '/projects',
  [
    ...paginationValidation,
    query('category').optional().trim().isLength({ max: 80 }),
    query('featured').optional().isIn(['true', 'false']),
  ],
  validateRequest,
  getProjects,
);

router.get(
  '/projects/:slug',
  [param('slug').trim().isLength({ min: 1, max: 180 }).matches(/^[a-z0-9-]+$/)],
  validateRequest,
  getProjectBySlug,
);

router.get('/experience', paginationValidation, validateRequest, getExperience);
router.get('/certificates', paginationValidation, validateRequest, getCertificates);
router.get('/skills', paginationValidation, validateRequest, getSkills);
router.get('/education', paginationValidation, validateRequest, getEducation);
router.get('/profile', getProfile);

export default router;
