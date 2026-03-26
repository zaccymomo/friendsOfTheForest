# Friends of the Forest

A gamified educational trail application where users explore nature trails, answer questions, and collect forest friend characters by gathering their body parts.

## Quick Start

### Option 1: Production (Railway)

The app is deployed at **https://friendsoftheforest-frontend-production.up.railway.app** - just visit and register!

### Option 2: Local Development (Docker)

```bash
# Clone the repository
git clone <repository-url>
cd friendsOfTheForest

# Create .env file with your NeonDB connection string
cat > backend/.env << EOF
DATABASE_URL="your-neondb-connection-string"
JWT_SECRET="change-this-to-a-secure-random-string"
EOF

# Build and start containers (migrations run automatically)
docker-compose up --build

# In another terminal, seed the database
./seed.sh
```

Then open `http://localhost:5173` and register an account!

### Option 3: Local Development (Manual Setup)

For experienced developers who prefer local development:

```bash
# Clone and setup
git clone <repository-url>
cd friendsOfTheForest

# Backend setup
cd backend
npm install
# Create .env with DATABASE_URL and JWT_SECRET
npm exec prisma migrate dev
npm exec prisma db seed
node index.js &

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` and register an account!

## Production Deployment (Railway)

The application is deployed on Railway with auto-deployment from GitHub. Every push to the `main` branch automatically triggers a new production deployment.

### Architecture

- **Backend Service**: Express.js API running on Railway
- **Frontend Service**: React SPA served with nginx on Railway
- **Database**: NeonDB (PostgreSQL) - managed separately
- **Assets**: AWS S3 for forest friend images

### Environment Variables

**Backend Service (Railway):**
- `DATABASE_URL` - Your NeonDB connection string
- `JWT_SECRET` - Secure random string for JWT signing (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `PORT` - 4000 (default)
- `FRONTEND_URL` - Frontend Railway URL for CORS (e.g., `https://your-frontend.railway.app`)

**Frontend Service (Railway):**
- `VITE_API_URL` - Backend Railway URL (e.g., `https://your-backend.railway.app`)

### Auto-Deployment Workflow

1. **Push to GitHub**: Commit and push changes to the `main` branch
2. **Railway Webhook**: Railway detects the push via GitHub webhook
3. **Build**: Railway builds both backend and frontend services in parallel
4. **Deploy**: New versions are deployed with zero downtime
5. **Health Check**: Railway verifies services are running

The deployment typically takes 2-3 minutes from push to live.

### Manual Deployment

If needed, you can manually trigger a deployment from the Railway dashboard:
1. Go to your project in Railway
2. Select the service (backend or frontend)
3. Click "Deploy" → "Redeploy"

### Production Build Details

**Frontend:**
- Multi-stage Docker build reduces image size from ~500MB to ~50MB
- Production build served via nginx (port 80)
- Gzip compression enabled
- Static asset caching (1 year)
- SPA routing configured

**Backend:**
- Runs on Node.js 20 Alpine
- Database migrations run automatically on deploy
- CORS restricted to frontend URL
- JWT authentication required for all endpoints except `/auth/*`

### Initial Railway Setup (For Reference)

If deploying a new Railway project:

1. **Create Railway Project**:
   - Connect your GitHub repository
   - Railway will detect `docker-compose.yml`

2. **Create Backend Service**:
   - Root directory: `/backend`
   - Use `backend/Dockerfile`
   - Port: 4000
   - Add environment variables from `backend/.env.example`

3. **Create Frontend Service**:
   - Root directory: `/frontend`
   - Use `frontend/Dockerfile`
   - Port: 80
   - Add `VITE_API_URL` pointing to backend Railway URL

4. **Configure Auto-Deploy**:
   - Settings → Deploy → Triggers
   - Enable "Deploy on push to main"

### Generate QR Codes for Production

Run locally with the production frontend URL:

```bash
cd backend
FRONTEND_URL=https://friendsoftheforest-frontend-production.up.railway.app node generate-qr-codes.js
```

QR code PNG files are saved to `backend/qr-codes/`. Each QR code encodes a full URL (e.g., `https://friendsoftheforest-frontend-production.up.railway.app/question/1`) so they work from any phone camera app — scanning opens the browser directly to the question page.

### Monitoring

Check service health in Railway dashboard:
- View deployment logs
- Monitor resource usage
- Check build status
- Review error alerts

## Features

- **Trail Exploration**: Browse and navigate physical nature trails with maps and descriptions
- **QR Code Scanning**: Scan QR codes at trail locations to unlock questions
- **Trivia Questions**: Answer multiple-choice and open-ended questions about nature
- **Collectible System**: Earn forest friend body parts with different rarity levels (COMMON, RARE, LEGENDARY)
- **Progressive Image Reveal**: Forest friend images are assembled piece by piece as you collect body parts
- **Progress Tracking**: Monitor your collection progress and completed trails
- **User Profiles**: Manage your account and view statistics

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS v4 for styling
- Axios for API requests
- react-qr-reader for QR scanning

**Backend:**
- Node.js with Express 5
- Prisma ORM
- PostgreSQL database (NeonDB)
- JWT authentication
- bcrypt for password hashing

## Prerequisites

### For Docker Setup (Recommended)
- **[Git](https://git-scm.com/downloads)** - Version control system
- **[Docker](https://www.docker.com/get-started)** - Containerization platform
- **[Docker Compose](https://docs.docker.com/compose/install/)** - Multi-container orchestration (included with Docker Desktop)
- **[NeonDB Account](https://neon.tech/)** - Serverless PostgreSQL database (free tier available)

### For Manual Setup
- **[Git](https://git-scm.com/downloads)** - Version control system
- **[Node.js](https://nodejs.org/)** (v16 or higher) - JavaScript runtime
- **npm** (comes with Node.js) - Package manager
- **[NeonDB Account](https://neon.tech/)** - Serverless PostgreSQL database (free tier available)

### Installing Dependencies

**Git:**
- **macOS**: Install [Xcode Command Line Tools](https://developer.apple.com/xcode/) or use [Homebrew](https://brew.sh/): `brew install git`
- **Windows**: Download from [git-scm.com](https://git-scm.com/downloads)
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

**Node.js:**
- Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

**NeonDB:**
- Sign up for a free account at [neon.tech](https://neon.tech/)
- No local installation required - NeonDB is a serverless PostgreSQL database

### Verifying Prerequisites

After installation, verify everything is set up correctly:

```bash
# Check Git installation
git --version
# Expected output: git version 2.x.x

# Check Node.js installation
node --version
# Expected output: v18.x.x or higher

# Check npm installation
npm --version
# Expected output: 9.x.x or higher
```

## Installation

Choose either Docker setup (recommended) or Manual setup below.

## Docker Setup (Recommended)

Docker setup eliminates dependency management issues and ensures consistent environments across all machines.

### 1. Clone the Repository

```bash
# Clone the repository (replace <repository-url> with actual URL)
git clone <repository-url>

# Navigate into the project directory
cd friendsOfTheForest
```

### 2. Set Up NeonDB Database

1. **Create a NeonDB project:**
   - Go to [neon.tech](https://neon.tech/) and sign in
   - Click "Create Project"
   - Choose a project name (e.g., "friends-of-forest")
   - Select your preferred region
   - Click "Create Project"

2. **Get your connection string:**
   - After creating the project, you'll see a connection string
   - It will look like: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
   - Copy this connection string - you'll need it in the next step
   - You can always find it later in the project dashboard under "Connection Details"

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Create .env file
cat > backend/.env << EOF
DATABASE_URL="your-neondb-connection-string-here"
JWT_SECRET="change-this-to-a-secure-random-string"
PORT=4000
EOF
```

Or create it manually with your preferred text editor.

### 4. Build and Start Docker Containers

```bash
# Build and start all services
docker-compose up --build
```

This will:
- Build Docker images for frontend and backend
- Automatically run database migrations on startup
- Start both services
- The backend will be available on `http://localhost:4000`
- The frontend will be available on `http://localhost:5173`

**Note:** Database migrations run automatically when the backend container starts. If the database already has a schema (e.g., from a previous setup), it will be automatically reset to match the current migrations.

### 5. Seed the Database

In a new terminal window (keep docker-compose running):

```bash
# Use the smart seed script (automatically detects if seeding or reseeding is needed)
./seed.sh
```

The script will:
- Check if the database has existing data
- Run initial seed if database is empty
- Run reseed (clear and seed) if data already exists

**Manual seeding options:**
```bash
# First time seed only
docker-compose exec backend npx prisma db seed

# Reseed (clear existing data and seed fresh)
docker-compose exec backend npm run reseed
```

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Manual Setup

For developers who prefer to run services locally without Docker.

### 1. Clone the Repository

```bash
# Clone the repository (replace <repository-url> with actual URL)
git clone <repository-url>

# Navigate into the project directory
cd friendsOfTheForest
```

### 2. Set Up NeonDB Database

1. **Create a NeonDB project:**
   - Go to [neon.tech](https://neon.tech/) and sign in
   - Click "Create Project"
   - Choose a project name (e.g., "friends-of-forest")
   - Select your preferred region
   - Click "Create Project"

2. **Get your connection string:**
   - After creating the project, you'll see a connection string
   - It will look like: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
   - Copy this connection string - you'll need it in the next step
   - You can always find it later in the project dashboard under "Connection Details"

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Or create .env manually (see below)
```

**Configure your database connection:**

Create or edit `backend/.env` with your NeonDB connection string:

```env
# Database connection string from NeonDB
# Paste the full connection string you copied from NeonDB
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# JWT secret for authentication (change this to a random string)
JWT_SECRET="change-this-to-a-secure-random-string-for-production"

# Server port (optional, defaults to 4000)
PORT=4000
```

**Important Notes:**
- Replace the entire `DATABASE_URL` value with your NeonDB connection string
- Keep `?sslmode=require` at the end of the connection string (required for NeonDB)
- For production, use a strong, unique JWT_SECRET
- Never commit your `.env` file to version control

**Run database migrations:**

```bash
# Create database tables
npm exec prisma migrate dev

# Generate Prisma Client
npm exec prisma generate

# Seed the database with initial data (trails, questions, forest friends)
npm exec prisma db seed
```

**Note:** Use `npm exec prisma` instead of `npx prisma` to ensure you're using the project's local Prisma version (6.x), not a globally installed version (which may be Prisma 7.x with breaking changes).

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from backend directory)
cd ../frontend

# Or from project root:
cd frontend

# Install dependencies
npm install
```

The frontend is configured to connect to `http://localhost:4000` by default. If your backend runs on a different URL, update `API_BASE` in `frontend/src/api.js`.

### 5. Verify Installation

At this point, your setup should be complete. Verify everything is installed:

```bash
# Check backend dependencies
cd backend
npm list --depth=0

# Check frontend dependencies
cd ../frontend
npm list --depth=0
```

## Running the Application

### With Docker

```bash
# Start all services
docker-compose up

# Or run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Admin portal: `http://localhost:5174`

### Manual Setup

You'll need two terminal windows/tabs:

**Terminal 1: Start Backend Server**

```bash
cd backend
node index.js
```

The API server will start on `http://localhost:4000`

**Terminal 2: Start Frontend Development Server**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## First Time Setup

1. **Register an Account**: Click "Register" on the login page and create a new account
2. **Explore Trails**: Browse available trails from the Trails page
3. **Start a Trail**: Select a trail to view details, map, and questions
4. **Scan QR Codes**: Use the QR Scanner to scan codes at trail locations (or navigate to questions directly during development)
5. **Answer Questions**: Correct answers award forest friend body parts
6. **Check Progress**: View your collection on the Friends page

## Development Tools

### Prisma Studio

View and edit your database with a GUI:

**With Docker:**
```bash
docker-compose exec backend npx prisma studio
```

**Manual Setup:**
```bash
cd backend
npm exec prisma studio
```

This opens a browser interface at `http://localhost:5555`

### Generate QR Codes

Generate QR code PNG files for all questions and save them to `backend/qr-codes/`:

**For local development** (QR codes link to localhost):
```bash
cd backend
node generate-qr-codes.js
```

**For production** (QR codes link to the live Railway app):
```bash
cd backend
FRONTEND_URL=https://friendsoftheforest-frontend-production.up.railway.app node generate-qr-codes.js
```

Each QR code encodes a full URL. Scanning with a native phone camera opens the app directly to the question page. The in-app QR scanner also handles these codes.

### Linting

```bash
cd frontend
npm run lint
```

### Build for Production

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

## Database Management

### Automatic Migrations (Docker Only)

When using Docker, database migrations run automatically every time the backend container starts. This means:
- New migrations are applied automatically
- If an existing schema is detected, the database is reset and migrations are reapplied
- The database schema stays in sync with your code
- No manual migration commands needed for normal development

**Note:** The automatic reset ensures a clean state matching your migrations, but will delete existing data.

### Reset Database

**With Docker:**
```bash
docker-compose exec backend npx prisma migrate reset
```

**Manual Setup:**
```bash
cd backend
npm exec prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

### Create New Migration

After modifying `backend/prisma/schema.prisma`, with your `DATABASE_URL` pointing at the **dev branch**:

```bash
cd backend
npm exec prisma migrate dev --name description_of_changes
```

This generates a migration file in `backend/prisma/migrations/` and applies it to the dev database. **Commit the migration file** — Railway uses it to update production automatically on the next deploy.

### Seed Database

**With Docker:**
```bash
# Smart seed script (auto-detects if initial seed or reseed is needed)
./seed.sh

# Manual options:
# Initial seed (empty database)
docker-compose exec backend npx prisma db seed

# Reseed (clear and repopulate)
docker-compose exec backend npm run reseed
```

**Manual Setup:**
```bash
cd backend

# Initial seed
npm exec prisma db seed

# Reseed (clear and repopulate)
npm run reseed
```

## Schema Changes & Migrations

**IMPORTANT:** The database is hosted on NeonDB (cloud PostgreSQL) with two separate branches:
- **`main` (production)** — used by the live Railway app. Never run `migrate dev` against this.
- **`development`** — used for local development. All schema changes happen here first.

### NeonDB Branch Setup

Your `backend/.env` `DATABASE_URL` must point at the **development branch** connection string. The Railway backend service must use the **production branch** connection string (set in Railway dashboard → Variables).

### Development Workflow (Making Schema Changes)

1. **Edit the schema:**
   ```
   backend/prisma/schema.prisma
   ```

2. **Create and apply the migration** (against dev branch only):
   ```bash
   cd backend
   npm exec prisma migrate dev --name describe_your_change
   ```
   This generates a migration file in `backend/prisma/migrations/` and applies it to the dev database.

3. **Update seed script if needed:**
   ```
   backend/prisma/seed.js
   ```

4. **Commit and push** — include both the schema change and the migration file:
   ```bash
   git add backend/prisma/schema.prisma backend/prisma/migrations/
   git commit -m "..."
   git push
   ```

5. **Railway auto-deploys** — on startup, the backend runs `prisma migrate deploy`, which applies the new migration to production safely with no data loss.

### Applying Migrations to Production Manually

If you ever need to apply migrations to production outside of a Railway deploy:

```bash
DATABASE_URL="<production-connection-string>" npm exec prisma migrate deploy
```

Never use `migrate dev` here — `migrate deploy` only applies pending migrations and never resets the database.

### Seeding Production (One-time)

```bash
DATABASE_URL="<production-connection-string>" npm exec prisma db seed
```

Only needed when bootstrapping a fresh production database. The seed script is idempotent (safe to run when data already exists).

### Command Reference

| Command | When to use |
|---|---|
| `prisma migrate dev` | Local only, against dev branch — creates migration files and applies them |
| `prisma migrate deploy` | Production / CI — applies pending migrations, never resets |
| `prisma db seed` | One-time data seeding, run manually |
| `prisma studio` | GUI to inspect/edit the database |

### Key Reminders

- **Never run `migrate dev` against the production connection string** — it can reset the database and delete all data
- **Always commit migration files** alongside schema changes — they are the source of truth for production
- **NeonDB is persistent** — it is in the cloud, unaffected by Docker or Railway restarts
- **Breaking changes** (renaming/dropping columns) require a data migration step — add it manually to the migration SQL file before deploying

## Project Structure

```
friendsOfTheForest/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema with body part images
│   │   ├── seed.js                # Database seeding script
│   │   └── migrations/            # Migration history
│   ├── routes/
│   │   ├── auth.js               # Login/register endpoints
│   │   ├── friends.js            # Forest friends collection API
│   │   ├── trails.js             # Trail listings and details
│   │   ├── questions.js          # Question retrieval and answering
│   │   └── profile.js            # User profile management
│   ├── index.js                  # Express server entry point
│   ├── generate-qr-codes.js      # QR code generation utility
│   ├── docker-entrypoint.sh      # Docker entrypoint with auto migrations
│   ├── Dockerfile                # Backend Docker configuration
│   ├── .dockerignore             # Docker ignore rules
│   ├── .env                      # Environment variables (not in git)
│   ├── .gitignore                # Git ignore rules for backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── TopBar.jsx       # Navigation bar with user info
│   │   │   └── Sidebar.jsx      # Friend selection sidebar
│   │   ├── pages/                # Route-level page components
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Friends.jsx      # Forest friends collection display
│   │   │   ├── Trails.jsx       # Trail listing page
│   │   │   ├── TrailDetail.jsx  # Individual trail details
│   │   │   ├── QRScanner.jsx    # QR code scanner
│   │   │   ├── Question.jsx     # Question answering interface
│   │   │   └── Profile.jsx      # User profile management
│   │   ├── config/
│   │   │   └── bodyPartPositions.js  # Body part image positioning config
│   │   ├── api.js               # API client functions
│   │   ├── App.jsx              # Main app component with routing
│   │   ├── ProtectedRoute.jsx   # Authentication route guard
│   │   └── main.jsx             # Application entry point
│   ├── public/                   # Static assets
│   ├── index.html
│   ├── Dockerfile                # Frontend Docker configuration
│   ├── .dockerignore             # Docker ignore rules
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── package.json
├── docker-compose.yml            # Docker orchestration configuration
├── seed.sh                       # Convenience script for database seeding
├── .gitignore                    # Root git ignore rules
└── README.md                     # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and receive JWT token

### Friends
- `GET /friends` - List all forest friends with user's collection progress

### Trails
- `GET /trails` - List all available trails
- `GET /trails/:id` - Get trail details, questions, and collectible body parts

### Questions
- `GET /questions/:id` - Get question details
- `POST /questions/:id/answer` - Submit answer (awards body parts if correct)

### Profile
- `GET /profile` - Get current user profile
- `POST /profile` - Update username/password

All endpoints except `/auth/*` require JWT authentication via `Authorization: Bearer <token>` header.

## Environment Variables

### Local Development

**Backend (`backend/.env`):**

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | NeonDB PostgreSQL connection string (must include `?sslmode=require`) | - |
| JWT_SECRET | Secret key for signing JWT tokens (use `backend/.env.example` to generate) | - |
| PORT | Server port | 4000 |

**Frontend (`frontend/.env` - optional for local dev):**

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:4000 |

### Production (Railway)

See the "Production Deployment (Railway)" section above for required environment variables. Never commit `.env` files to version control - use Railway's dashboard to configure production environment variables.

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Port already in use:**
```bash
# Stop all containers
docker-compose down

# Check what's using the ports
lsof -i :4000
lsof -i :5173

# Kill the process or change ports in docker-compose.yml
```

**Database migrations not working:**

Migrations run automatically when the backend container starts. The entrypoint script will automatically reset the database if it detects an existing schema.

```bash
# Check backend container logs
docker-compose logs backend

# Verify DATABASE_URL in backend/.env is correct
cat backend/.env

# If migrations still fail, manually reset:
docker-compose exec backend npx prisma migrate reset --force
docker-compose restart backend
```

**Hot reload not working:**
- Ensure volumes are correctly mounted in docker-compose.yml
- Try restarting the containers: `docker-compose restart`

**npm peer dependency errors:**
- The project uses `--legacy-peer-deps` for `react-qr-reader` compatibility with React 18
- This is already configured in the Dockerfiles
- If you see peer dependency errors, rebuild with: `docker-compose build --no-cache`

### Database Connection Issues

- Verify your NeonDB connection string in `backend/.env` is correct
- Ensure the connection string includes `?sslmode=require` at the end
- Check that your NeonDB project is active (not suspended due to inactivity on free tier)
- Verify network connectivity - NeonDB requires internet access
- Check the NeonDB dashboard for any service status issues

### Port Already in Use

If port 4000 or 5173 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically try the next available port

### Prisma Client Issues

If you see "Prisma Client not generated" errors:

```bash
cd backend
npm exec prisma generate
```

### Prisma Version Mismatch

If you see errors about "`url` is no longer supported in schema files" or other Prisma 7 errors:

- This means you have Prisma 7.x installed globally but the project uses Prisma 6.x
- **Solution:** Always use `npm exec prisma` instead of `npx prisma` to use the project's local version
- Alternatively, uninstall the global Prisma: `npm uninstall -g prisma`

### QR Scanner Not Working

- Ensure you're using HTTPS or localhost (camera access requires secure context)
- Check browser permissions for camera access
- Try using a different browser (Chrome/Firefox recommended)

### Body Part Images Not Showing

If body part images don't appear on the Friends page:
- Check that the body part has an `imageUrl` in the database
- Verify the image URL is accessible (try opening it in a browser)
- Check browser console for CORS or 404 errors
- For body parts without images, alt text should appear instead

### Authentication/Token Issues

If you get "Foreign key constraint" errors after database resets:
- Log out and log back in to get a fresh JWT token
- Clear localStorage in browser DevTools: `localStorage.clear()`
- The error occurs when JWT contains a userId that no longer exists in the database

### Common Git Issues

**"Repository not found" error:**
- Verify you have access to the repository
- Check if the repository URL is correct
- Ensure Git is properly installed: `git --version`

**Permission denied (publickey):**
- Set up SSH keys: [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- Or use HTTPS URL instead of SSH URL

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly (both frontend and backend)
4. Submit a pull request

## License

[Your License Here]
