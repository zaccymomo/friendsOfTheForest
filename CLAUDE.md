# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Friends of the Forest is a gamified educational trail application where users collect "Forest Friends" by completing nature trails and answering questions. The application uses a collectible body parts system with rarity tiers (COMMON, RARE, LEGENDARY).

## Architecture

This is a full-stack application with a monorepo structure deployed on Railway:

- **Backend** (`/backend`): Express.js REST API with Prisma ORM (deployed on Railway)
- **Frontend** (`/frontend`): React SPA built with Vite, served via nginx (deployed on Railway)
- **Database**: PostgreSQL via NeonDB (serverless, cloud-hosted)
- **Assets**: AWS S3 for forest friend images

### Authentication Flow

JWT-based authentication is implemented across both frontend and backend:
- Backend generates JWT tokens in [auth.js](backend/routes/auth.js) using `JWT_SECRET` environment variable
- Frontend stores tokens in localStorage and includes them in request headers via [api.js](frontend/src/api.js)
- Protected routes use `requireAuth` middleware that validates JWT tokens and extracts `userId`

### Core Data Models

The Prisma schema ([schema.prisma](backend/prisma/schema.prisma)) defines these key relationships:

- **ForestFriend** → **ForestFriendBodyPart**: One friend has many body parts (each with a rarity)
- **Trail** → **Question**: Each trail contains multiple questions
- **Question** → **ForestFriendBodyPart**: Correct answers award specific body parts
- **User** → **UserBodyPart**: Tracks which body parts a user has collected
- **Trail** → **TrailBodyPart**: Defines which body parts are available on each trail

### API Architecture

All routes follow RESTful conventions and require JWT authentication (except `/auth/*`):

- `/auth` - Register/login endpoints
- `/friends` - GET list of forest friends with user's collection progress
- `/trails` - GET trails list and individual trail details (with questions and collectible body parts)
- `/questions/:id` - GET question details, POST answer submission (awards body parts on correct answers)
- `/profile` - GET/POST user profile management

Each route file duplicates the `requireAuth` middleware - consider extracting to a shared middleware file.

## Development Commands

### Backend

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client (run after schema changes)
npx prisma generate

# Seed database with initial data
npx prisma db seed

# Start development server (port 4000)
node index.js

# View database in Prisma Studio
npx prisma studio
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Environment Configuration

### Local Development

**Backend (`backend/.env`):**
```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="secure-random-32-character-string"  # Required, no fallback
PORT=4000  # Optional, defaults to 4000
```

**Frontend (`frontend/.env` - optional for local):**
```
VITE_API_URL=http://localhost:4000  # Defaults to this if not set
```

### Production (Railway)

**Backend Environment Variables:**
- `DATABASE_URL` - NeonDB connection string (same as local dev or separate production database)
- `JWT_SECRET` - Secure random string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `PORT` - 4000
- `FRONTEND_URL` - Frontend Railway URL for CORS (e.g., `https://your-frontend.railway.app`)

**Frontend Environment Variables:**
- `VITE_API_URL` - Backend Railway URL (build-time variable, baked into production bundle)

**Important Security Notes:**
- The backend now **requires** `JWT_SECRET` to be set - it will throw an error if missing (no 'devsecret' fallback)
- CORS is restricted to `FRONTEND_URL` in production (falls back to `*` for local dev)
- Never commit `.env` files - use Railway dashboard to set production variables

## Database Schema Notes

- **Composite Primary Keys**: `UserBodyPart`, `UserTrail`, and `TrailBodyPart` use composite PKs (`@@id`)
- **Question Types**: `MCQ` (multiple choice with options) and `OPEN` (text-based answer validation)
- **Answer Validation**:
  - MCQ questions check option.correct flag
  - OPEN questions perform case-insensitive string comparison
- **Duplicate Awards Prevention**: System checks existing UserBodyPart before awarding

## Key Application Flows

### Trail Completion Flow

1. User selects a trail from `/trails` page
2. Trail detail page shows map, description, photos, and available body parts
3. User scans QR codes (via `/scan` route using react-qr-reader) to access questions
4. Questions are answered via `/question/:id` route
5. Correct answers award body parts (if not already collected)
6. Progress is tracked via UserBodyPart join table

### Collection Tracking

The Friends page aggregates data to show:
- Total forest friends and completed friends count
- Per-friend: total body parts vs. collected parts
- Individual body part collection status with rarity indicators

## Frontend Routing Structure

[App.jsx](frontend/src/App.jsx) uses react-router-dom with a shared `ProtectedLayout` wrapper that:
- Fetches and displays user's friends collection in TopBar
- Provides logout functionality
- Wraps all authenticated routes

All protected routes automatically redirect to `/login` if no token exists.

## Code Organization Patterns

- **API Layer**: All HTTP requests centralized in [frontend/src/api.js](frontend/src/api.js)
- **Route Handlers**: Backend routes in `/backend/routes/*.js` (one file per resource)
- **Components**: Frontend UI components in `/frontend/src/components/`
- **Pages**: Route-level components in `/frontend/src/pages/`

## Production Deployment

### Railway Setup

The application is deployed on Railway with automatic deployment from GitHub:

**Services:**
1. **Backend Service**:
   - Root directory: `/backend`
   - Uses `backend/Dockerfile`
   - Port: 4000
   - Migrations run automatically on deploy via `docker-entrypoint.sh`

2. **Frontend Service**:
   - Root directory: `/frontend`
   - Uses multi-stage `frontend/Dockerfile` (production build with nginx)
   - Port: 80
   - Static assets served via nginx with gzip compression and caching

**Auto-Deployment Workflow:**
1. Push to `main` branch on GitHub
2. Railway webhook triggers automatic build
3. Both services build in parallel using Dockerfiles
4. Backend runs `prisma migrate deploy` automatically
5. Services deploy with zero downtime (~2-3 minutes total)

**Frontend Production Build:**
- Multi-stage Docker build (build stage + nginx serve stage)
- Vite production bundle served via nginx
- Image size: ~50MB (vs ~500MB dev build)
- SPA routing configured in [nginx.conf](frontend/nginx.conf)
- Static asset caching (1 year) for JS/CSS/images
- Gzip compression enabled

**CORS Configuration:**
- Backend restricts CORS to `FRONTEND_URL` environment variable
- Railway magic syntax: `${{frontend.RAILWAY_PUBLIC_DOMAIN}}` auto-references frontend URL

### Development vs Production

**Local Development:**
- Frontend: Vite dev server with HMR (`npm run dev`)
- Backend: Express directly (`node index.js`)
- Access: `http://localhost:5173` → `http://localhost:4000`

**Production (Railway):**
- Frontend: nginx serving static build from `/dist`
- Backend: Express in Docker container
- Access: `https://[app].railway.app` → `https://[app]-backend.railway.app`
- HTTPS automatic with zero configuration

## Development Notes

- No TypeScript - uses JSX and plain JavaScript throughout
- Tailwind CSS v4 for styling (configured in [tailwind.config.js](frontend/tailwind.config.js))
- No testing framework currently configured
- Database seed script available at [prisma/seed.js](backend/prisma/seed.js)
- QR scanning requires HTTPS (works in production, use Railway URLs for mobile testing)
