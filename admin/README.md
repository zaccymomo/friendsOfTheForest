# Friends of the Forest - Admin Panel

A comprehensive admin panel for managing trails, questions, forest friends, and users for the Friends of the Forest gamified trail application.

## Features

- **Dashboard** - Overview statistics and quick actions
- **Trail Management** - Create/edit trails with photos and maps
- **Question Management** - Create MCQ and open-ended questions
- **Forest Friends Management** - Manage collectible characters and body parts
- **User Management** - View users, manage roles, and track progress
- **Image Upload** - S3 integration for all images
- **Role-Based Access** - Admin-only authentication

## Tech Stack

- **Frontend**: React 18 + React Router 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **HTTP Client**: Axios
- **Deployment**: Docker + nginx

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (see `/backend`)
- AWS S3 credentials (for image uploads)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL
# VITE_API_URL=http://localhost:4000
```

### Development

```bash
# Start development server
npm run dev

# Access at http://localhost:5174
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Default Credentials

- **Username**: `admin`
- **Password**: `admin`
- ⚠️ **Change immediately after first login!**

## Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AdminLayout.jsx  # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── ImageUpload.jsx
│   │   └── ConfirmDialog.jsx
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Admin login
│   │   ├── Dashboard.jsx   # Overview
│   │   ├── trails/         # Trail management
│   │   ├── questions/      # Question management
│   │   ├── friends/        # Forest Friends management
│   │   └── users/          # User management
│   ├── api.js              # API client
│   ├── App.jsx             # Router configuration
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── Dockerfile              # Production build
├── nginx.conf              # nginx configuration
└── package.json
```

## API Endpoints

The admin panel uses these backend endpoints:

- `GET/POST/PUT/DELETE /admin/friends` - Forest Friends
- `GET/POST/PUT/DELETE /admin/bodyparts` - Body Parts
- `GET/POST/PUT/DELETE /admin/trails` - Trails
- `POST /admin/trails/:id/photos` - Upload trail photos
- `DELETE /admin/trails/:trailId/photos/:photoId` - Delete photos
- `GET/POST/PUT/DELETE /admin/questions` - Questions
- `GET/PUT/DELETE /admin/users` - Users
- `PUT /admin/users/:id/role` - Change user role

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:4000
```

### Production (Railway)
```env
VITE_API_URL=https://your-backend.railway.app
```

## Deployment

### Docker Build

```bash
# Build with API URL
docker build --build-arg VITE_API_URL=https://api.example.com -t admin-panel .

# Run container
docker run -p 80:80 admin-panel
```

### Railway Deployment

1. Create new Railway service
2. Set root directory to `/admin`
3. Configure environment variables:
   - `VITE_API_URL` = Backend URL
4. Railway will auto-build using Dockerfile
5. Access at your Railway URL

## Authentication

The admin panel uses JWT tokens for authentication:

- Login requires ADMIN role
- Token stored in localStorage as `adminToken`
- Token included in all API requests via Authorization header
- Automatic redirect to login if token is missing or invalid

## Key Features

### Trail Management
- Create trails with name, description, and map
- Upload multiple trail photos
- Link body parts to trails
- Edit and delete trails

### Question Management
- Create MCQ (multiple choice) questions
- Create OPEN (text answer) questions
- Link questions to trails
- Assign body part rewards
- Manage answer options

### Forest Friends Management
- Create collectible characters
- Upload outline images
- Create body parts with rarity levels
- Upload regular and zoomed images for body parts

### User Management
- View all users and their statistics
- See user collection progress
- Promote users to admin
- Demote admins to regular users
- Delete user accounts

## Security

- Admin-only access enforced by backend
- Role validation on login
- Confirmation dialogs for destructive actions
- Protection against self-deletion
- Separate token storage from user app

## Development Notes

- Uses Vite for fast development and optimized builds
- Tailwind CSS for utility-first styling
- React Router for client-side routing
- Axios for HTTP requests
- All forms include validation
- Loading states for async operations
- Error handling with user-friendly messages

## License

This admin panel is part of the Friends of the Forest project.
