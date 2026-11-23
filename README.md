# MERN Portfolio

## Overview

A React/Vite portfolio with an Express API, MongoDB persistence, protected admin dashboard, JWT cookie authentication, CSRF protection, and optional Cloudinary file uploads.

## Architecture

- `client/`: React public portfolio and admin dashboard
- `server/`: Express API, Mongoose models, authentication, uploads, and seed scripts
- MongoDB: portfolio content and upload metadata
- Cloudinary: profile, project, certificate, gallery, and resume files

## Installation

Requirements:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB local or MongoDB Atlas
- Optional Cloudinary account

```powershell
npm install
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

## Environment variables

### Server

| Name | Required | Purpose |
|---|---|---|
| `PORT` | No | API port, default `5000` |
| `CORS_ORIGIN` | Yes | Comma-separated frontend origins |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NODE_ENV` | Yes | `development` or `production` |
| `JWT_SECRET` | Yes | Long random JWT signing secret |
| `JWT_EXPIRES_IN` | No | Session lifetime, default `15m` |
| `ADMIN_EMAIL` | Setup only | Initial owner email |
| `ADMIN_PASSWORD` | Setup only | Initial owner password |
| `CLOUDINARY_CLOUD_NAME` | Upload only | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Upload only | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Upload only | Cloudinary API secret |
| `SITE_URL` | SEO | Public production origin |

### Client

| Name | Purpose |
|---|---|
| `VITE_API_URL` | Backend origin |

Never commit real values in `server/.env` or `client/.env`.

## Database setup

Local MongoDB:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
```

Atlas:

```text
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/portfolio
```

Seed the known static portfolio content:

```powershell
npm run seed -w server
```

Seed scripts contain verified portfolio content and should not be used as a substitute for the admin dashboard.

## Admin setup

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` in `server/.env`, then run:

```powershell
npm run create-admin -w server
```

Use a password of at least 12 characters. The account exists only after this command succeeds. The dashboard is available at `/admin/login`.

## Development

Run both applications:

```powershell
npm run dev
```

Run separately:

```powershell
npm run dev -w client
npm run dev -w server
```

## Testing

Backend infrastructure tests:

```powershell
npm test -w server
```

Frontend build and lint:

```powershell
npm run lint -w client
npm run build
```

## API summary

Public:

- `GET /api/profile`
- `GET /api/skills`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/experience`
- `GET /api/certificates`
- `GET /api/education`
- `GET /api/health`

Authentication:

- `GET /api/auth/csrf`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Protected admin:

- `GET /api/admin/status`
- `GET|PUT /api/admin/profile`
- `GET|POST /api/admin/:collection`
- `GET|PUT|DELETE /api/admin/:collection/:id`
- `GET|POST|DELETE /api/admin/uploads`

The `:collection` value is one of `projects`, `experience`, `certificates`, `skills`, or `education`.

## Production build

```powershell
npm run build
npm run start -w server
```

Set production environment variables, HTTPS cookies, allowed frontend origins, MongoDB Atlas credentials, and Cloudinary credentials before deployment.

Replace `https://example.com` in the canonical URL, Open Graph URL, robots sitemap, and sitemap XML with the real production domain.
