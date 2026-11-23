import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Certificate from '../models/Certificate.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Profile from '../models/Profile.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const collections = {
  projects: {
    model: Project,
    sort: { displayOrder: 1, featured: -1, createdAt: -1 },
  },
  experience: {
    model: Experience,
    sort: { displayOrder: 1, startDate: -1 },
  },
  certificates: {
    model: Certificate,
    sort: { displayOrder: 1, issueDate: -1 },
  },
  skills: {
    model: Skill,
    sort: { displayOrder: 1, name: 1 },
  },
  education: {
    model: Education,
    sort: { displayOrder: 1, startDate: -1 },
  },
};

const getCollection = (request) => {
  const collection = collections[request.params.collection];
  if (!collection) {
    const error = new Error('Content collection not found.');
    error.statusCode = 404;
    throw error;
  }
  return collection;
};

export const listAdminContent = asyncHandler(async (request, response) => {
  const { model, sort } = getCollection(request);
  const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 100, 1), 100);
  const [items, total] = await Promise.all([
    model.find().sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    model.countDocuments(),
  ]);
  response.status(200).json({
    success: true,
    data: items,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
});

export const getAdminContent = asyncHandler(async (request, response) => {
  const { model } = getCollection(request);
  if (!mongoose.isValidObjectId(request.params.id)) {
    const error = new Error('Invalid content ID.');
    error.statusCode = 400;
    throw error;
  }
  const item = await model.findById(request.params.id).lean();
  if (!item) {
    const error = new Error('Content not found.');
    error.statusCode = 404;
    throw error;
  }
  response.status(200).json({ success: true, data: item });
});

export const createAdminContent = asyncHandler(async (request, response) => {
  const { model } = getCollection(request);
  delete request.body._id;
  delete request.body.createdAt;
  delete request.body.updatedAt;

  const item = await model.create(request.body);
  response.status(201).json({ success: true, message: 'Content created.', data: item });
});

export const updateAdminContent = asyncHandler(async (request, response) => {
  const { model } = getCollection(request);
  if (!mongoose.isValidObjectId(request.params.id)) {
    const error = new Error('Invalid content ID.');
    error.statusCode = 400;
    throw error;
  }

  const item = await model.findById(request.params.id);
  if (!item) {
    const error = new Error('Content not found.');
    error.statusCode = 404;
    throw error;
  }

  delete request.body._id;
  delete request.body.createdAt;
  delete request.body.updatedAt;

  if (model.modelName === 'Project' && request.body.title && !request.body.slug) {
    if (request.body.title !== item.title) {
      item.slug = undefined;
    }
  }

  item.set(request.body);
  await item.save();

  response.status(200).json({ success: true, message: 'Content updated.', data: item });
});

export const deleteAdminContent = asyncHandler(async (request, response) => {
  const { model } = getCollection(request);
  if (!mongoose.isValidObjectId(request.params.id)) {
    const error = new Error('Invalid content ID.');
    error.statusCode = 400;
    throw error;
  }
  const item = await model.findByIdAndDelete(request.params.id);
  if (!item) {
    const error = new Error('Content not found.');
    error.statusCode = 404;
    throw error;
  }
  response.status(200).json({ success: true, message: 'Content deleted.' });
});

export const getAdminProfile = asyncHandler(async (request, response) => {
  const profile = await Profile.findOne().sort({ updatedAt: -1 }).lean();
  response.status(200).json({ success: true, data: profile });
});

export const updateAdminProfile = asyncHandler(async (request, response) => {
  delete request.body._id;
  delete request.body.createdAt;
  delete request.body.updatedAt;

  let profile = await Profile.findOne().sort({ updatedAt: -1 });
  if (profile) {
    profile.set(request.body);
    await profile.save();
  } else {
    profile = await Profile.create(request.body);
  }

  response.status(200).json({ success: true, message: 'Profile updated.', data: profile });
});
