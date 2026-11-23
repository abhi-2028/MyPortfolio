import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRoutes from './routes/healthRoutes.js';
import publicContentRoutes from './routes/publicContentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Project from './models/Project.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const corsError = new Error(`Origin is not allowed: ${origin}`);
      corsError.statusCode = 403;
      callback(corsError);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/robots.txt', (request, response) => {
  const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/+$/, '');
  response.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (request, response, next) => {
  try {
    const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/+$/, '');
    const projects = await Project.find().select('slug updatedAt').lean();
    const urls = [
      { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
      ...projects.map((project) => ({
        loc: `${siteUrl}/projects/${encodeURIComponent(project.slug)}`,
        lastmod: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
        changefreq: 'monthly',
        priority: '0.7',
      })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">\n${urls
      .map((url) => `  <url>\n    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`)
      .join('\n')}\n</urlset>`;
    response.type('application/xml').send(xml);
  } catch (error) {
    next(error);
  }
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicContentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
