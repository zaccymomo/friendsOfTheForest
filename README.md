# Friends of the Forest

A gamified educational trail application where users explore nature trails, answer questions, and collect forest friend characters by gathering their body parts.

## Features

- **Trail Exploration**: Browse and navigate physical nature trails with maps and descriptions
- **QR Code Scanning**: Scan QR codes at trail locations to unlock questions
- **Trivia Questions**: Answer multiple-choice and open-ended questions about nature
- **Collectible System**: Earn forest friend body parts with different rarity levels (COMMON, RARE, LEGENDARY)
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
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (comes with Node.js)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd friendsOfTheForest
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Or create .env manually with the following content:
# DATABASE_URL="postgresql://username:password@localhost:5432/friends_of_forest"
# JWT_SECRET="your-secure-secret-key-here"
# PORT=4000
```

**Configure your database connection:**

Edit `backend/.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/friends_of_forest"
JWT_SECRET="change-this-to-a-secure-random-string"
PORT=4000
```

**Run database migrations:**

```bash
# Create database tables
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed the database with initial data (trails, questions, forest friends)
npx prisma db seed
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

The frontend is configured to connect to `http://localhost:4000` by default. If your backend runs on a different URL, update `API_BASE` in `frontend/src/api.js`.

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
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.js                # Database seeding script
│   │   └── migrations/            # Migration history
│   ├── routes/
│   │   ├── auth.js               # Login/register endpoints
│   │   ├── friends.js            # Forest friends collection
│   │   ├── trails.js             # Trail listings and details
│   │   ├── questions.js          # Question retrieval and answering
│   │   └── profile.js            # User profile management
│   ├── index.js                  # Express server entry point
│   ├── generate-qr-codes.js      # QR code generation utility
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route-level page components
│   │   ├── api.js               # API client functions
│   │   ├── App.jsx              # Main app component with routing
│   │   └── main.jsx             # Application entry point
│   ├── public/                   # Static assets
│   ├── index.html
│   └── package.json
└── README.md
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

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly (both frontend and backend)
4. Submit a pull request

## License

[Your License Here]
