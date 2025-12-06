# Friends of the Forest

A gamified educational trail application where users explore nature trails, answer questions, and collect forest friend characters by gathering their body parts.

## Quick Start

### Option 1: Docker (Recommended)

The easiest way to get started:

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

# In another terminal, seed the database (first time only)
docker-compose exec backend npx prisma db seed
# Or use the convenience script:
./seed.sh
```

Then open `http://localhost:5173` and register an account!

### Option 2: Manual Setup

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

**Note:** Database migrations are now run automatically when the backend container starts, so you don't need to run them manually!

### 5. Seed the Database (First Time Only)

In a new terminal window (keep docker-compose running):

```bash
# Seed the database with initial data
docker-compose exec backend npx prisma db seed

# Or use the convenience script
./seed.sh
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

To generate QR codes for questions:

```bash
cd backend
node generate-qr-codes.js
```

This creates QR codes linking to question IDs that can be printed and placed at trail locations.

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
- The database schema stays in sync with your code
- No manual migration commands needed for normal development

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

After modifying `backend/prisma/schema.prisma`:

**With Docker:**
```bash
# Create the migration file
docker-compose exec backend npx prisma migrate dev --name description_of_changes

# The migration will automatically run on next container restart
docker-compose restart backend
```

**Manual Setup:**
```bash
npm exec prisma migrate dev --name description_of_changes
```

### Seed Database

**With Docker:**
```bash
docker-compose exec backend npx prisma db seed
# Or use the convenience script:
./seed.sh
```

**Manual Setup:**
```bash
cd backend
npm exec prisma db seed
```

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

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | NeonDB PostgreSQL connection string (must include `?sslmode=require`) | - |
| JWT_SECRET | Secret key for signing JWT tokens | devsecret |
| PORT | Server port | 4000 |

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

Migrations run automatically when the backend container starts. If you see migration errors:

```bash
# Check backend container logs
docker-compose logs backend

# Verify DATABASE_URL in backend/.env is correct
cat backend/.env

# If needed, run migrations manually
docker-compose exec backend npx prisma migrate deploy

# Reset database (WARNING: This deletes all data)
docker-compose exec backend npx prisma migrate reset
```

**Hot reload not working:**
- Ensure volumes are correctly mounted in docker-compose.yml
- Try restarting the containers: `docker-compose restart`

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
