import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Certificate from '../models/Certificate.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Profile from '../models/Profile.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});

export const getProjects = asyncHandler(async (request, response) => {
  const page = parsePositiveInteger(request.query.page, 1);
  const limit = Math.min(parsePositiveInteger(request.query.limit, 12), 100);
  const filter = {};

  if (request.query.category) filter.category = request.query.category;
  if (request.query.featured !== undefined) {
    filter.featured = request.query.featured === 'true';
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ displayOrder: 1, featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  response.status(200).json({
    success: true,
    data: projects,
    pagination: paginationMeta(total, page, limit),
  });
});

export const getProjectBySlug = asyncHandler(async (request, response) => {
  const project = await Project.findOne({ slug: request.params.slug }).lean();

  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }

  response.status(200).json({ success: true, data: project });
});

const getOrderedCollection = (Model, sort) =>
  asyncHandler(async (request, response) => {
    const page = parsePositiveInteger(request.query.page, 1);
    const limit = Math.min(parsePositiveInteger(request.query.limit, 100), 100);
    const [items, total] = await Promise.all([
      Model.find()
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Model.countDocuments(),
    ]);

    response.status(200).json({
      success: true,
      data: items,
      pagination: paginationMeta(total, page, limit),
    });
  });

export const getExperience = getOrderedCollection(Experience, { displayOrder: 1, startDate: -1 });
export const getCertificates = getOrderedCollection(Certificate, { displayOrder: 1, issueDate: -1 });
export const getSkills = getOrderedCollection(Skill, { displayOrder: 1, name: 1 });
export const getEducation = getOrderedCollection(Education, { displayOrder: 1, startDate: -1 });

export const getProfile = asyncHandler(async (request, response) => {
  const profile = await Profile.findOne().sort({ updatedAt: -1 }).lean();

  if (!profile) {
    const error = new Error('Profile not found.');
    error.statusCode = 404;
    throw error;
  }

  response.status(200).json({ success: true, data: profile });
});
