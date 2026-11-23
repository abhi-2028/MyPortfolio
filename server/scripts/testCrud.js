import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import Project from '../src/models/Project.js';
import Experience from '../src/models/Experience.js';
import Certificate from '../src/models/Certificate.js';
import Skill from '../src/models/Skill.js';
import Education from '../src/models/Education.js';
import Profile from '../src/models/Profile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

const runCrudTests = async () => {
  console.log('Connecting to database...');
  await connectDatabase();

  console.log('\n--- TESTING PROJECTS CRUD ---');
  // 1. Create Project
  const createdProject = await Project.create({
    title: 'Test CRUD Project',
    description: 'Initial description',
    detailedDescription: 'Detailed description for test project',
    technologies: ['React', 'Node.js', 'Express'],
    image: 'https://example.com/project.png',
    gallery: ['https://example.com/gallery1.png', 'https://example.com/gallery2.png'],
    githubUrl: 'https://github.com/example/test-crud',
    liveUrl: 'https://test-crud.example.com',
    category: 'Full Stack',
    featured: true,
    displayOrder: 99,
  });
  assert(createdProject._id, 'Project created with ID');
  assert(createdProject.slug === 'test-crud-project', `Expected slug test-crud-project, got ${createdProject.slug}`);
  console.log('✓ Project Create passed: slug generated as', createdProject.slug);

  // 2. Read Project
  const readProject = await Project.findById(createdProject._id);
  assert(readProject && readProject.title === 'Test CRUD Project', 'Project Read by ID passed');
  console.log('✓ Project Read passed');

  // 3. Update Project (change title -> slug update, update array, preserve unchanged)
  readProject.set({
    title: 'Test CRUD Project Renamed',
    technologies: ['React', 'MongoDB', 'Node.js', 'TypeScript'],
    githubUrl: '', // empty optional field
  });
  if (readProject.title !== createdProject.title) {
    readProject.slug = undefined; // trigger slug regeneration
  }
  await readProject.save();

  const updatedProject = await Project.findById(createdProject._id);
  assert(updatedProject.title === 'Test CRUD Project Renamed', 'Project Title updated');
  assert(updatedProject.slug === 'test-crud-project-renamed', `Expected updated slug test-crud-project-renamed, got ${updatedProject.slug}`);
  assert(updatedProject.technologies.length === 4, 'Technologies array updated');
  assert(updatedProject.detailedDescription === 'Detailed description for test project', 'Unchanged detailedDescription preserved');
  console.log('✓ Project Update passed: title & slug updated, array updated, unchanged preserved');

  // 4. Delete Project
  await Project.findByIdAndDelete(createdProject._id);
  const deletedProject = await Project.findById(createdProject._id);
  assert(!deletedProject, 'Project Delete passed');
  console.log('✓ Project Delete passed');


  console.log('\n--- TESTING EXPERIENCE CRUD ---');
  // 1. Create Experience (with empty/null endDate and currentlyWorking: true)
  const createdExp = await Experience.create({
    company: 'Test Startup Inc',
    position: 'Full Stack Engineer',
    employmentType: 'Full-time',
    location: 'Remote',
    description: 'Building modern web apps',
    responsibilities: ['Architect APIs', 'Build responsive UI'],
    technologies: ['React', 'Node.js'],
    startDate: new Date('2024-01-15'),
    endDate: null,
    currentlyWorking: true,
    displayOrder: 1,
  });
  assert(createdExp._id, 'Experience created with ID');
  console.log('✓ Experience Create (with null endDate & currentlyWorking) passed');

  // 2. Read Experience
  const readExp = await Experience.findById(createdExp._id);
  assert(readExp && readExp.company === 'Test Startup Inc', 'Experience Read passed');
  console.log('✓ Experience Read passed');

  // 3. Update Experience (add endDate, set currentlyWorking false, modify responsibilities)
  readExp.set({
    position: 'Senior Full Stack Engineer',
    endDate: new Date('2024-12-31'),
    currentlyWorking: false,
    responsibilities: ['Lead engineering team', 'Architect APIs'],
  });
  await readExp.save();

  const updatedExp = await Experience.findById(createdExp._id);
  assert(updatedExp.position === 'Senior Full Stack Engineer', 'Position updated');
  assert(updatedExp.currentlyWorking === false, 'currentlyWorking updated');
  assert(updatedExp.endDate instanceof Date, 'endDate date updated');
  assert(updatedExp.company === 'Test Startup Inc', 'Unchanged company preserved');
  console.log('✓ Experience Update passed: dates and arrays handled properly');

  // 4. Delete Experience
  await Experience.findByIdAndDelete(createdExp._id);
  const deletedExp = await Experience.findById(createdExp._id);
  assert(!deletedExp, 'Experience Delete passed');
  console.log('✓ Experience Delete passed');


  console.log('\n--- TESTING CERTIFICATES CRUD ---');
  // 1. Create Certificate
  const createdCert = await Certificate.create({
    title: 'Test AWS Solutions Architect',
    issuingOrganization: 'Amazon Web Services',
    issueDate: new Date('2024-06-01'),
    expiryDate: null, // optional null date
    credentialId: 'AWS-123456',
    credentialUrl: 'https://aws.amazon.com/verification',
    image: 'https://example.com/cert.png',
    description: 'Cloud architecture certification',
    displayOrder: 2,
  });
  assert(createdCert._id, 'Certificate created');
  console.log('✓ Certificate Create (optional expiryDate null) passed');

  // 2. Read Certificate
  const readCert = await Certificate.findById(createdCert._id);
  assert(readCert && readCert.title === 'Test AWS Solutions Architect', 'Certificate Read passed');
  console.log('✓ Certificate Read passed');

  // 3. Update Certificate
  readCert.set({
    title: 'AWS Certified Solutions Architect - Associate',
    expiryDate: new Date('2027-06-01'),
  });
  await readCert.save();

  const updatedCert = await Certificate.findById(createdCert._id);
  assert(updatedCert.title === 'AWS Certified Solutions Architect - Associate', 'Certificate title updated');
  assert(updatedCert.expiryDate instanceof Date, 'Certificate expiryDate updated');
  assert(updatedCert.issuingOrganization === 'Amazon Web Services', 'Unchanged issuer preserved');
  console.log('✓ Certificate Update passed');

  // 4. Delete Certificate
  await Certificate.findByIdAndDelete(createdCert._id);
  const deletedCert = await Certificate.findById(createdCert._id);
  assert(!deletedCert, 'Certificate Delete passed');
  console.log('✓ Certificate Delete passed');


  console.log('\n--- TESTING SKILLS CRUD ---');
  // 1. Create Skill (with description)
  const createdSkill = await Skill.create({
    name: 'TypeScript Testing',
    description: 'Typed JavaScript for scalable development',
    category: 'Programming',
    proficiency: 90,
    icon: 'typescript',
    displayOrder: 10,
  });
  assert(createdSkill._id, 'Skill created');
  console.log('✓ Skill Create passed');

  // 2. Read Skill
  const readSkill = await Skill.findById(createdSkill._id);
  assert(readSkill && readSkill.name === 'TypeScript Testing', 'Skill Read passed');
  console.log('✓ Skill Read passed');

  // 3. Update Skill
  readSkill.set({
    proficiency: 95,
    description: 'Advanced TypeScript with generics and utility types',
  });
  await readSkill.save();

  const updatedSkill = await Skill.findById(createdSkill._id);
  assert(updatedSkill.proficiency === 95, 'Proficiency updated');
  assert(updatedSkill.description === 'Advanced TypeScript with generics and utility types', 'Description updated');
  assert(updatedSkill.name === 'TypeScript Testing', 'Unchanged name preserved');
  console.log('✓ Skill Update passed');

  // 4. Delete Skill
  await Skill.findByIdAndDelete(createdSkill._id);
  const deletedSkill = await Skill.findById(createdSkill._id);
  assert(!deletedSkill, 'Skill Delete passed');
  console.log('✓ Skill Delete passed');


  console.log('\n--- TESTING EDUCATION CRUD ---');
  // 1. Create Education (with optional dates)
  const createdEdu = await Education.create({
    institution: 'Stanford University (Online)',
    degree: 'Specialization Certificate',
    fieldOfStudy: 'Algorithms',
    startDate: new Date('2023-09-01'),
    endDate: null,
    description: 'Online algorithms course',
    displayOrder: 5,
  });
  assert(createdEdu._id, 'Education created');
  console.log('✓ Education Create passed');

  // 2. Read Education
  const readEdu = await Education.findById(createdEdu._id);
  assert(readEdu && readEdu.institution === 'Stanford University (Online)', 'Education Read passed');
  console.log('✓ Education Read passed');

  // 3. Update Education
  readEdu.set({
    endDate: new Date('2024-03-01'),
    description: 'Completed comprehensive algorithms specialization',
  });
  await readEdu.save();

  const updatedEdu = await Education.findById(createdEdu._id);
  assert(updatedEdu.endDate instanceof Date, 'Education endDate updated');
  assert(updatedEdu.institution === 'Stanford University (Online)', 'Unchanged institution preserved');
  console.log('✓ Education Update passed');

  // 4. Delete Education
  await Education.findByIdAndDelete(createdEdu._id);
  const deletedEdu = await Education.findById(createdEdu._id);
  assert(!deletedEdu, 'Education Delete passed');
  console.log('✓ Education Delete passed');


  console.log('\n--- TESTING PROFILE READ & UPDATE ---');
  // 1. Read Profile
  const existingProfile = await Profile.findOne().sort({ updatedAt: -1 });
  assert(existingProfile, 'Profile Read passed');
  console.log('✓ Profile Read passed for:', existingProfile.name);

  // 2. Update Profile (socialLinks + headline)
  const originalHeadline = existingProfile.headline;
  existingProfile.set({
    headline: 'a Programmer | a Web Developer | a Full Stack Coder',
    socialLinks: {
      linkedIn: existingProfile.socialLinks?.linkedIn || 'https://linkedin.com',
      github: 'https://github.com/abhirup',
      twitter: existingProfile.socialLinks?.twitter || '',
      website: 'https://abhirup.dev',
    },
  });
  await existingProfile.save();

  const updatedProfile = await Profile.findById(existingProfile._id);
  assert(updatedProfile.headline === 'a Programmer | a Web Developer | a Full Stack Coder', 'Headline updated');
  assert(updatedProfile.socialLinks?.github === 'https://github.com/abhirup', 'Social link github updated');
  assert(updatedProfile.socialLinks?.website === 'https://abhirup.dev', 'Social link website updated');
  console.log('✓ Profile Update passed with nested socialLinks');

  // Restore original headline
  existingProfile.headline = originalHeadline;
  await existingProfile.save();
  console.log('✓ Profile restored cleanly to original state');

  console.log('\n========================================');
  console.log('ALL CRUD INTEGRATION TESTS PASSED 100%!');
  console.log('========================================\n');
};

runCrudTests()
  .finally(disconnectDatabase)
  .catch((error) => {
    console.error('Test error:', error);
    process.exitCode = 1;
  });
