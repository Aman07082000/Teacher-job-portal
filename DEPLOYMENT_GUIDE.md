# Deployment Guide - Teacher Job Portal on Android

This guide helps you deploy your Teacher Job Portal to the cloud so you can access it from Android devices.

## Option 1: Deploy with Render.com (Recommended for beginners)

### Step 1: Prepare Your Backend

1. **Create `.env` file in root directory** (if you don't have one):
```env
PORT=5000
DATABASE_URL=postgresql://user:password@your-database-host:5432/teacher_portal
JWT_SECRET=your_secret_key_here_change_this_in_production
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

2. **Ensure your backend is ready**:
   - Check `src/server.js` listens on `process.env.PORT`
   - Update CORS configuration to accept requests from your frontend URL

### Step 2: Deploy Backend to Render

1. Push your code to GitHub (create a GitHub repo if you don't have one)
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill in the form:
   - **Name**: `teacher-portal-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables** (in Render dashboard):
   - Add all variables from your `.env` file
   - **DATABASE_URL**: Use PostgreSQL from Render (see Step 3)

7. Deploy and copy your backend URL (e.g., `https://teacher-portal-backend.onrender.com`)

### Step 3: Set up PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in details and create
3. Copy the connection string and use it as `DATABASE_URL` in your backend environment variables
4. Run migrations if needed

### Step 4: Deploy Frontend to Render or Vercel

**Option A: Render**
1. Create another Web Service for the frontend
2. Configure:
   - **Runtime**: `Node`
   - **Build Command**: `npm run build` (run from `frontend/` directory)
   - **Start Command**: `npm start`
   - **Publish directory**: `.next`

3. Add environment variable:
   - **NEXT_PUBLIC_API_URL**: `https://teacher-portal-backend.onrender.com`

**Option B: Vercel (Easier for Next.js)**
1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Select the `frontend/` folder as root directory
3. Add environment variable: `NEXT_PUBLIC_API_URL` pointing to your backend URL
4. Deploy

### Step 5: Update Your Frontend API Calls

1. Update [frontend/lib/api.ts](frontend/lib/api.ts) to use:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

2. Make sure all axios calls use this base URL

### Step 6: Update CORS in Backend

Update your backend CORS configuration in [src/app.js](src/app.js):
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Step 7: Access from Android

Once deployed:
1. On your Android device, open Chrome or Firefox
2. Navigate to your frontend URL (e.g., `https://teacher-portal.vercel.app`)
3. The app will communicate with your cloud backend automatically

---

## Option 2: Deploy with Railway.app

Railway is even simpler:

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add a service for:
   - Backend (Node.js)
   - Frontend (Next.js)
   - PostgreSQL (built-in)
4. Set environment variables in the Railway dashboard
5. Domains are automatically assigned

---

## Troubleshooting

### CORS errors?
- Make sure `CORS_ORIGIN` in backend matches your frontend URL
- Ensure backend env var is set correctly in frontend: `NEXT_PUBLIC_API_URL`

### Database not connecting?
- Verify `DATABASE_URL` connection string
- Run migrations on the cloud database
- Check database logs in your hosting dashboard

### Can't access from Android?
- Use the full HTTPS URL provided by Render/Vercel/Railway
- Clear browser cache
- Try incognito mode first

---

## Files to Update

1. **Root `.env`** - Add database and JWT secrets
2. **[frontend/lib/api.ts](frontend/lib/api.ts)** - Update API base URL
3. **[src/app.js](src/app.js)** - Update CORS settings
4. **[frontend/.env.production](frontend/.env.production)** - Add production API URL

---

## Next Steps

After deployment:
- Test all features (auth, job posting, applications)
- Monitor logs in your hosting dashboard
- Set up SSL/TLS (usually automatic)
- Consider upgrading to paid tier if needed

Have questions? Check your hosting platform's documentation.
