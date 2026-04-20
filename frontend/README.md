# Teacher Job Portal - Frontend

A modern Next.js frontend for the Teacher Job Portal with three separate dashboards for Teachers, Schools, and Admins.

## Features

### Teacher Panel
- Job search with filters
- View job details
- Apply to jobs
- Track applications
- Manage profile

### School Panel
- Dashboard with statistics
- Post new jobs
- Manage applicants
- Shortlist candidates
- View school profile

### Admin Panel
- User management
- Job monitoring
- Platform analytics
- System statistics

## Tech Stack
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── globals.css          # Global styles
├── auth/
│   ├── login/           # Login page
│   └── register/        # Register page
├── teacher/
│   ├── dashboard/       # Teacher dashboard
│   ├── profile/         # Teacher profile
│   ├── applications/    # Track applications
│   └── jobs/            # Job details & apply
├── school/
│   ├── dashboard/       # School dashboard
│   ├── profile/         # School profile
│   ├── jobs/            # Manage jobs
│   └── applicants/      # Manage applicants
└── admin/
    ├── dashboard/       # Admin dashboard
    ├── users/           # User management
    ├── jobs/            # Job monitoring
    └── settings/        # Platform settings

components/
└── Navbar.tsx           # Navigation component

lib/
├── api.ts               # API client & endpoints
└── store.ts             # Zustand auth store
```

## Authentication Flow

1. Users register or login via `/auth/register` or `/auth/login`
2. JWT token is stored in localStorage
3. Token is automatically included in all API requests via axios interceptor
4. Auth state is managed globally with Zustand
5. Protected routes redirect to home if not authenticated

## API Integration

The frontend connects to the backend API at `http://localhost:4000/api`:

- **Auth**: Register, Login
- **Teacher**: Profile, Job Search, Apply, Track Applications
- **School**: Profile, Post Jobs, Manage Applicants, Shortlist
- **Admin**: Users, Jobs, Analytics
- **Jobs**: Get all jobs with filters

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:4000/api |

## Key Dependencies

- `next`: React framework
- `react`: UI library
- `typescript`: Type safety
- `tailwindcss`: Styling
- `zustand`: State management
- `axios`: HTTP client
- `react-icons`: Icon library

## Notes

- All environment variables prefixed with `NEXT_PUBLIC_` are available in the browser
- Make sure the backend is running on `http://localhost:4000` before starting the frontend
- Responsive design works on mobile, tablet, and desktop
