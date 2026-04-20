# Quick Deployment Checklist

## Before Deployment

- [ ] Push your code to GitHub (if not already done)
- [ ] Test all features locally (auth, jobs, applications)
- [ ] Review environment variables in `.env.example`

## Step-by-Step Deployment (Choose One Platform)

### Choose Your Platform
- [ ] **Render** (easiest, recommended)
- [ ] **Railway** (also easy, great free tier)
- [ ] **Vercel** (for frontend only, then pair with separate backend)

---

## Platform Setup Instructions

### 1. Render.com Deployment

#### Backend Setup
```
1. Go to render.com → Sign up with GitHub
2. New → Web Service
3. Connect your GitHub repo (select the Teacher-Job-Portal repo)
4. Configure:
   - Name: teacher-portal-backend
   - Environment: Node
   - Build: npm install
   - Start: npm start
5. Add Environment Variables:
   - PORT: 5000
   - NODE_ENV: production
   - JWT_SECRET: (generate a strong key)
   - DATABASE_URL: (from PostgreSQL below)
   - FRONTEND_URL: (your frontend URL, e.g., teacher-portal.vercel.app)
6. Deploy
```

#### PostgreSQL Setup (on Render)
```
1. In Render → New → PostgreSQL
2. Create database
3. Copy Connection String and use as DATABASE_URL for backend
4. Note: Run migrations if needed
```

#### Frontend Setup
```
1. New → Web Service
2. Configure:
   - Name: teacher-portal-frontend
   - Environment: Node
   - Build: cd frontend && npm run build
   - Start: cd frontend && npm start
   - Publish: ./frontend/.next
3. Add Environment Variable:
   - NEXT_PUBLIC_API_URL: https://teacher-portal-backend.onrender.com/api
4. Deploy
```

---

### 2. Railway.app Deployment (Even Simpler!)

```
1. Go to railway.app
2. Connect GitHub repo
3. Add services: PostgreSQL, Backend, Frontend
4. Set environment variables in dashboard
5. Domains auto-generated for each service
6. Done!
```

---

### 3. Vercel + Render.com Combo (Recommended for Best Performance)

#### Frontend (Vercel)
```
1. Go to vercel.com
2. Import GitHub repo
3. Set root directory: ./frontend
4. Add environment variable:
   - NEXT_PUBLIC_API_URL: https://your-backend-on-render.com/api
5. Deploy
```

#### Backend (Render)
```
Follow Render backend setup above
```

---

## Accessing from Android

After deployment:

1. On your Android device, open Chrome/Firefox
2. Enter your frontend URL (provided by your hosting platform)
3. App works exactly like localhost but accessible from anywhere!

**Example:**
- Frontend: `https://teacher-portal.vercel.app`
- Backend: `https://teacher-portal-backend.onrender.com`
- Database: Hosted on Render PostgreSQL

---

## Troubleshooting

### CORS Error?
```
✓ Make sure FRONTEND_URL matches your frontend domain
✓ Check backend environment variables
```

### Cannot connect to database?
```
✓ Verify DATABASE_URL connection string
✓ Check database credentials
✓ Run migrations: npm run migrate (if you have migrations)
```

### Frontend showing "Cannot reach API"?
```
✓ Check NEXT_PUBLIC_API_URL environment variable
✓ Verify backend is deployed and running
✓ Check backend logs in hosting dashboard
```

### Want to test locally with cloud database?
```
Update .env locally:
DATABASE_URL=your_render_db_connection_string
npm start
```

---

## Recommended Platform: Render.com

Why Render?
- ✅ Free tier with 750 compute hours/month
- ✅ Built-in PostgreSQL
- ✅ Supports Node.js and Next.js
- ✅ Easy environment variables
- ✅ Good free tier (better than Heroku now)

---

## After Going Live

1. Monitor logs in your hosting dashboard
2. Set up SSL/TLS (usually automatic)
3. Test all features from Android
4. Share your app URL with others
5. Scale as needed with paid plans

**You're now accessible from Android (and anywhere else)! 🚀**
