import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';

describe('Portfolio API infrastructure', () => {
  it('returns the health endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data.service', 'portfolio-api');
  });

  it('returns a consistent 404 for unknown API routes', async () => {
    const response = await request(app).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('rejects unauthenticated admin session checks', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('rejects unauthenticated protected admin access', async () => {
    const response = await request(app).get('/api/admin/status');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('rejects invalid login input without attempting login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bad', password: 'short' });
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('rejects an origin outside the CORS allowlist', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://invalid.example');
    expect(response.status).toBe(403);
  });

  it('serves robots.txt', async () => {
    const response = await request(app).get('/robots.txt');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Sitemap:');
  });
});
