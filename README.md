# Teacher Job Portal

A full-featured job portal platform with three separate panels for Teachers, Schools, and Administrators.

## Features

### Teacher Panel
- Registration and profile creation
- Job search with filters (title, location, subject)
- Job application submission
- Application tracking and status monitoring
- Notifications

### School Panel
- Registration and profile setup
- Job posting and management
- Applicant management
- Candidate shortlisting
- Application review

### Admin Panel
- User management and monitoring
- Job posting oversight
- Platform analytics and statistics
- System control and management

## Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs

## Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)

### Setup

1. **Clone the repository**
   ```bash
   cd /Users/amanvats/Documents/Teacher-Job-Portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database**
   - Create a new database: `createdb teacher_job_portal`
   - Run the schema: `psql teacher_job_portal < sql/schema.sql`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL credentials and JWT secret.

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Teacher Routes
- `POST /api/teachers/profile` - Create teacher profile
- `GET /api/teachers/jobs` - Search jobs with filters
- `POST /api/teachers/jobs/:jobId/apply` - Apply to a job
- `GET /api/teachers/applications` - Track applications

### School Routes
- `POST /api/schools/profile` - Create school profile
- `POST /api/schools/jobs` - Post a new job
- `GET /api/schools/applicants` - View applicants
- `POST /api/schools/applicants/:applicationId/shortlist` - Shortlist candidate

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Monitor all jobs
- `GET /api/admin/analytics` - Get platform analytics

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/search?title=math&location=NY&subject=Mathematics` - Search jobs with filters

## Job Integration & Testing

The platform includes comprehensive job integration features for testing purposes, simulating jobs from multiple real-world platforms.

### Supported Platforms
- **Indeed** - Popular job search platform
- **LinkedIn** - Professional networking platform
- **Glassdoor** - Company reviews and job platform
- **SchoolSpring** - Education-specific job board
- **Education Week** - Education news and jobs

### Sample Job Data
The seeding system includes **35+ diverse teaching positions** across:
- **Subjects**: Mathematics, Science, English, Special Education, Art, Music, Physical Education, Computer Science, STEM, ESL, Foreign Languages, History, French, Drama, Gifted Education, Business, Environmental Science, Reading, Technology, Bilingual Education, Health, Library Science, Speech Therapy, Counseling, Automotive, Culinary, Digital Media, Psychology, Sociology, Economics, Philosophy, Journalism
- **Grade Levels**: Elementary, Middle School, High School, Early Childhood, Special Education
- **Locations**: Major cities across the US (NYC, LA, Chicago, Boston, Seattle, Philadelphia, New Orleans, Las Vegas, San Diego, Detroit, Portland, Baltimore, Salt Lake City, El Paso, Minneapolis, Pittsburgh, Milwaukee, Omaha, Tucson, Albuquerque, Colorado Springs, Reno, Fresno, Wichita, Providence, Boise, Raleigh, etc.)
- **Salary Ranges**: $38,000 - $78,000 (realistic for teaching positions)
- **Platforms**: Indeed, LinkedIn, Glassdoor, SchoolSpring, Education Week

### Seeding Jobs (Command Line)

```bash
# Seed jobs from all platforms
npm run seed-jobs

# Clear all jobs and school data
npm run clear-jobs
```

### Seeding Jobs (API - Admin Only)

```bash
# Seed jobs (requires admin authentication)
curl -X POST http://localhost:4000/api/jobs/seed \
  -H "Authorization: Bearer <admin-jwt-token>"

# Clear all jobs (requires admin authentication)
curl -X DELETE http://localhost:4000/api/jobs/clear \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### Testing Workflow

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Create an admin user** (or use existing admin account)

3. **Seed test data**
   ```bash
   npm run seed-jobs
   ```

4. **Test the platform**
   - Register as a teacher
   - Search for jobs using filters
   - Apply to positions
   - Register as a school to see applications
   - Use admin panel to monitor everything

### Job Search Examples

```bash
# Search for math jobs in New York
GET /api/jobs/search?title=math&location=New%20York

# Search for science teaching positions
GET /api/jobs/search?subject=Science

# Search for high-paying computer science jobs
GET /api/jobs/search?subject=Computer%20Science
```

### Benefits for Testing
- **Realistic data** from actual job platforms
- **Diverse job types** covering all teaching specializations
- **Geographic coverage** across major US cities
- **Quick setup** with single command
- **Clean teardown** to reset test environment
- **Performance testing** with substantial dataset
```
src/
├── config/
│   └── db.js          # PostgreSQL connection
├── controllers/       # Business logic
├── middleware/        # Auth and error handling
├── models/           # Database models
├── routes/           # API routes
├── app.js            # Express app setup
└── server.js         # Entry point

sql/
└── schema.sql        # Database schema
```

## Authentication & Role-Based Access

The platform implements comprehensive role-based access control with three user types:

### User Roles
- **Teacher**: Can search jobs, apply to positions, manage applications
- **School**: Can post jobs, manage applicants, review applications  
- **Admin**: Can manage users, monitor jobs, view analytics, perform administrative actions

### Admin Access
Admins have exclusive access to:
- User management (view, update, delete users)
- Job monitoring and management
- Platform analytics and statistics
- Data seeding and clearing operations

### Creating Admin User
```bash
npm run create-admin
```
This creates an admin user with credentials:
- Email: `admin@teacherportal.com`
- Password: `admin123`

### Frontend Security
- **RoleGuard Component**: Protects admin pages from unauthorized access
- **Automatic Redirects**: Users are redirected to appropriate dashboards based on their role
- **JWT Authentication**: All protected routes require valid authentication tokens

### Testing Admin Features
1. Create admin user: `npm run create-admin`
2. Login with admin credentials
3. Access admin dashboard at `/admin/dashboard`
4. Navigate to user management and job monitoring
