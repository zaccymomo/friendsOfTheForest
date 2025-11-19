# Friends of the Forest

A gamified educational trail application where users explore nature trails, answer questions, and collect forest friend characters by gathering their body parts.

## Quick Start

For experienced developers, here's the TL;DR:

```bash
# Clone and setup
git clone <repository-url>
cd friendsOfTheForest

# Backend setup
cd backend
npm install
# Create .env with DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma db seed
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
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- **[Git](https://git-scm.com/downloads)** - Version control system
- **[Node.js](https://nodejs.org/)** (v16 or higher) - JavaScript runtime
- **[PostgreSQL](https://www.postgresql.org/)** (v12 or higher) - Database
- **npm** (comes with Node.js) - Package manager

### Installing Dependencies

**Git:**
- **macOS**: Install [Xcode Command Line Tools](https://developer.apple.com/xcode/) or use [Homebrew](https://brew.sh/): `brew install git`
- **Windows**: Download from [git-scm.com](https://git-scm.com/downloads)
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

**Node.js:**
- Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

**PostgreSQL:**
- **macOS**:
  - With Homebrew: `brew install postgresql@15` then `brew services start postgresql@15`
  - Or download [Postgres.app](https://postgresapp.com/)
- **Windows**: Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Linux**: `sudo apt-get install postgresql postgresql-contrib` (Ubuntu/Debian)

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

# Check PostgreSQL installation
psql --version
# Expected output: psql (PostgreSQL) 12.x or higher

# Check if PostgreSQL is running (macOS/Linux)
pg_isready
# Expected output: /tmp:5432 - accepting connections

# Or check status (macOS with Homebrew)
brew services list | grep postgresql
# Expected output: postgresql@15 started
```

## Installation

### 1. Clone the Repository

```bash
# Clone the repository (replace <repository-url> with actual URL)
git clone <repository-url>

# Navigate into the project directory
cd friendsOfTheForest
```

If you don't have a repository URL yet, you can initialize a new Git repository:

```bash
# Initialize Git (only if not cloning)
git init
git add .
git commit -m "Initial commit"
```

### 2. Create PostgreSQL Database

Before setting up the backend, create the database:

```bash
# Connect to PostgreSQL (macOS/Linux)
psql postgres

# Or on Windows, use pgAdmin or:
psql -U postgres

# In the PostgreSQL prompt, create the database:
CREATE DATABASE friends_of_forest;

# Create a user (optional, if you want a dedicated user)
CREATE USER forest_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE friends_of_forest TO forest_user;

# Exit PostgreSQL
\q
```

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

Create or edit `backend/.env` with your PostgreSQL credentials:

```env
# Database connection string
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/friends_of_forest"

# Or if you created a dedicated user:
# DATABASE_URL="postgresql://forest_user:your_password@localhost:5432/friends_of_forest"

# JWT secret for authentication (change this to a random string)
JWT_SECRET="change-this-to-a-secure-random-string-for-production"

# Server port (optional, defaults to 4000)
PORT=4000
```

**Important Notes:**
- Replace `your_password` with your actual PostgreSQL password
- For production, use a strong, unique JWT_SECRET
- The default PostgreSQL user is usually `postgres`

**Run database migrations:**

```bash
# Create database tables
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed the database with initial data (trails, questions, forest friends)
npx prisma db seed
```

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

You'll need two terminal windows/tabs:

### Terminal 1: Start Backend Server

```bash
cd backend
node index.js
```

The API server will start on `http://localhost:4000`

### Terminal 2: Start Frontend Development Server

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

```bash
cd backend
npx prisma studio
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

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

### Create New Migration

After modifying `backend/prisma/schema.prisma`:

```bash
npx prisma migrate dev --name description_of_changes
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
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── package.json
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
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for signing JWT tokens | devsecret |
| PORT | Server port | 4000 |

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready`
- Verify credentials in `backend/.env`
- Check if database exists: `psql -l`

### Port Already in Use

If port 4000 or 5173 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically try the next available port

### Prisma Client Issues

If you see "Prisma Client not generated" errors:

```bash
cd backend
npx prisma generate
```

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
