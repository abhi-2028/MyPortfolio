import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import app from '../src/app.js';
import Project from '../src/models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
};

const runApiTests = async () => {
  console.log('Connecting to database...');
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  console.log('\n--- 1. Testing CSRF Token Issuance ---');
  const csrfInitRes = await request(app).get('/api/auth/csrf');
  assert(csrfInitRes.status === 200, 'CSRF endpoint status 200');
  let csrfToken = csrfInitRes.body.data.csrfToken;
  assert(csrfToken, 'CSRF token returned in response');
  let csrfCookie = csrfInitRes.headers['set-cookie']
    .find((cookie) => cookie.startsWith('portfolio_csrf='));
  assert(csrfCookie, 'CSRF cookie received');
  console.log('✓ CSRF token and cookie received successfully');

  console.log('\n--- 2. Testing Admin Login ---');
  const loginRes = await request(app)
    .post('/api/auth/login')
    .set('Cookie', [csrfCookie])
    .set('X-CSRF-Token', csrfToken)
    .send({ email, password });

  assert(loginRes.status === 200, `Login failed: status ${loginRes.status} ${JSON.stringify(loginRes.body)}`);
  assert(loginRes.body.success, 'Login response success is true');
  console.log('✓ Admin login successful');

  const authCookie = loginRes.headers['set-cookie']
    .find((cookie) => cookie.startsWith('portfolio_admin='));
  assert(authCookie, 'Authentication cookie received');

  const cookies = [authCookie, csrfCookie];

  console.log('\n--- 3. Testing Protected Admin Verification ---');
  const statusRes = await request(app)
    .get('/api/admin/status')
    .set('Cookie', cookies);
  assert(statusRes.status === 200, 'Admin status status 200');
  assert(statusRes.body.data.role === 'owner', 'Role is owner');
  console.log('✓ Admin session verified');

  console.log('\n--- 4. Testing Admin Project POST (Create) via API ---');
  const createProjectRes = await request(app)
    .post('/api/admin/projects')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      title: 'API Test Project',
      description: 'Created via admin REST API',
      detailedDescription: 'Full description for API test project',
      technologies: ['React', 'Express'],
      image: 'https://example.com/api-test.png',
      gallery: ['https://example.com/api-test-1.png'],
      githubUrl: 'https://github.com/example/api-test',
      liveUrl: 'https://api-test.example.com',
      category: 'Web',
      featured: true,
      displayOrder: 88,
    });

  assert(createProjectRes.status === 201, `Project Create failed: ${createProjectRes.status} ${JSON.stringify(createProjectRes.body)}`);
  const createdProjectId = createProjectRes.body.data._id;
  assert(createdProjectId, 'Project created with ID');
  assert(createProjectRes.body.data.slug === 'api-test-project', 'Slug generated');
  console.log('✓ Admin Project Create endpoint passed (201)');

  console.log('\n--- 5. Testing Admin Project PUT (Edit/Update) via API ---');
  const updateProjectRes = await request(app)
    .put(`/api/admin/projects/${createdProjectId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      title: 'API Test Project Modified',
      description: 'Modified description via PUT',
      detailedDescription: 'Full description for API test project',
      technologies: ['React', 'Express', 'MongoDB'],
      image: 'https://example.com/api-test-modified.png',
      gallery: [],
      githubUrl: '',
      liveUrl: 'https://api-test-modified.example.com',
      category: 'Full Stack',
      featured: false,
      displayOrder: 89,
    });

  assert(updateProjectRes.status === 200, `Project Update failed: ${updateProjectRes.status} ${JSON.stringify(updateProjectRes.body)}`);
  assert(updateProjectRes.body.data.title === 'API Test Project Modified', 'Title updated');
  assert(updateProjectRes.body.data.slug === 'api-test-project-modified', 'Slug regenerated on title change');
  assert(updateProjectRes.body.data.technologies.length === 3, 'Technologies updated');
  console.log('✓ Admin Project Update endpoint passed (200)');

  console.log('\n--- 6. Testing Admin Project GET (List & Detail) via API ---');
  const listProjectsRes = await request(app)
    .get('/api/admin/projects')
    .set('Cookie', cookies);
  assert(listProjectsRes.status === 200, 'List projects status 200');
  const found = listProjectsRes.body.data.find((p) => p._id === createdProjectId);
  assert(found && found.title === 'API Test Project Modified', 'Modified project found in admin list');

  const detailRes = await request(app)
    .get(`/api/admin/projects/${createdProjectId}`)
    .set('Cookie', cookies);
  assert(detailRes.status === 200, 'Get detail status 200');
  assert(detailRes.body.data.title === 'API Test Project Modified', 'Detail project title matches');
  console.log('✓ Admin Project List and Detail endpoints passed');

  console.log('\n--- 7. Testing Admin Project DELETE via API ---');
  const deleteRes = await request(app)
    .delete(`/api/admin/projects/${createdProjectId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken);
  assert(deleteRes.status === 200, 'Delete project status 200');

  const verifyDeleted = await Project.findById(createdProjectId);
  assert(!verifyDeleted, 'Project verified deleted from MongoDB');
  console.log('✓ Admin Project Delete endpoint passed (200)');

  console.log('\n--- 8. Testing Admin Profile GET and PUT via API ---');
  const getProfileRes = await request(app)
    .get('/api/admin/profile')
    .set('Cookie', cookies);
  assert(getProfileRes.status === 200, 'Get profile status 200');
  const profile = getProfileRes.body.data;
  assert(profile, 'Profile data retrieved');

  const updateProfileRes = await request(app)
    .put('/api/admin/profile')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      name: profile.name,
      headline: profile.headline,
      bio: profile.bio,
      profileImage: profile.profileImage,
      location: profile.location,
      socialLinks: {
        linkedIn: profile.socialLinks?.linkedIn || '',
        github: 'https://github.com/AbhirupCode',
        twitter: profile.socialLinks?.twitter || '',
        website: 'https://example.com',
      },
    });
  assert(updateProfileRes.status === 200, 'Update profile status 200');
  assert(updateProfileRes.body.data.socialLinks.github === 'https://github.com/AbhirupCode', 'Profile github link updated');
  console.log('✓ Admin Profile GET and PUT endpoints passed');

  console.log('\n--- 9. Testing Admin Experience CRUD via API ---');
  const createExpRes = await request(app)
    .post('/api/admin/experience')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      company: 'API Test Company',
      position: 'Developer',
      startDate: '2024-01-01',
      endDate: null,
      currentlyWorking: true,
      responsibilities: ['Build features'],
      technologies: ['React'],
    });
  assert(createExpRes.status === 201, 'Create experience 201');
  const expId = createExpRes.body.data._id;

  const updateExpRes = await request(app)
    .put(`/api/admin/experience/${expId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      company: 'API Test Company',
      position: 'Senior Developer',
      startDate: '2024-01-01',
      endDate: '2024-12-01',
      currentlyWorking: false,
    });
  assert(updateExpRes.status === 200, 'Update experience 200');
  assert(updateExpRes.body.data.position === 'Senior Developer', 'Position updated');

  const deleteExpRes = await request(app)
    .delete(`/api/admin/experience/${expId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken);
  assert(deleteExpRes.status === 200, 'Delete experience 200');
  console.log('✓ Admin Experience CRUD endpoints passed');

  console.log('\n--- 10. Testing Admin Certificates CRUD via API ---');
  const createCertRes = await request(app)
    .post('/api/admin/certificates')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      title: 'API Test Certificate',
      issuingOrganization: 'Test Org',
      issueDate: '2024-05-01',
      expiryDate: null,
    });
  assert(createCertRes.status === 201, 'Create certificate 201');
  const certId = createCertRes.body.data._id;

  const updateCertRes = await request(app)
    .put(`/api/admin/certificates/${certId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      title: 'API Test Certificate Updated',
      issuingOrganization: 'Test Org Updated',
      issueDate: '2024-05-01',
    });
  assert(updateCertRes.status === 200, 'Update certificate 200');
  assert(updateCertRes.body.data.title === 'API Test Certificate Updated', 'Title updated');

  const deleteCertRes = await request(app)
    .delete(`/api/admin/certificates/${certId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken);
  assert(deleteCertRes.status === 200, 'Delete certificate 200');
  console.log('✓ Admin Certificates CRUD endpoints passed');

  console.log('\n--- 11. Testing Admin Skills CRUD via API ---');
  const createSkillRes = await request(app)
    .post('/api/admin/skills')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      name: 'API Test Skill',
      category: 'Backend',
      proficiency: 80,
      icon: 'node',
    });
  assert(createSkillRes.status === 201, 'Create skill 201');
  const skillId = createSkillRes.body.data._id;

  const updateSkillRes = await request(app)
    .put(`/api/admin/skills/${skillId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      name: 'API Test Skill Updated',
      proficiency: 85,
    });
  assert(updateSkillRes.status === 200, 'Update skill 200');
  assert(updateSkillRes.body.data.name === 'API Test Skill Updated', 'Skill name updated');

  const deleteSkillRes = await request(app)
    .delete(`/api/admin/skills/${skillId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken);
  assert(deleteSkillRes.status === 200, 'Delete skill 200');
  console.log('✓ Admin Skills CRUD endpoints passed');

  console.log('\n--- 12. Testing Admin Education CRUD via API ---');
  const createEduRes = await request(app)
    .post('/api/admin/education')
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      institution: 'API Test University',
      degree: 'B.Tech',
      fieldOfStudy: 'CS',
      startDate: '2022-08-01',
      endDate: null,
    });
  assert(createEduRes.status === 201, 'Create education 201');
  const eduId = createEduRes.body.data._id;

  const updateEduRes = await request(app)
    .put(`/api/admin/education/${eduId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken)
    .send({
      institution: 'API Test University',
      degree: 'B.Tech with Honors',
      startDate: '2022-08-01',
      endDate: '2026-06-01',
    });
  assert(updateEduRes.status === 200, 'Update education 200');
  assert(updateEduRes.body.data.degree === 'B.Tech with Honors', 'Degree updated');

  const deleteEduRes = await request(app)
    .delete(`/api/admin/education/${eduId}`)
    .set('Cookie', cookies)
    .set('X-CSRF-Token', csrfToken);
  assert(deleteEduRes.status === 200, 'Delete education 200');
  console.log('✓ Admin Education CRUD endpoints passed');

  console.log('\n=============================================');
  console.log('ALL ADMIN REST API ENDPOINTS TESTED AND PASSED!');
  console.log('=============================================\n');
};

runApiTests()
  .finally(disconnectDatabase)
  .catch((error) => {
    console.error('API Test error:', error);
    process.exitCode = 1;
  });
