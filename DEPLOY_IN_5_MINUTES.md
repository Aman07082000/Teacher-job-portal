# Deploy to Android in 5 Minutes ⚡

**Use Render.com** — It's the fastest way to go live.

## 🚀 Quick Start (5 minutes)

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/teacher-job-portal.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account (1 min)
1. Go to **[render.com](https://render.com)**
2. Click "Get Started" → Sign up with GitHub
3. Authorize Render to access your repos

### Step 3: Deploy Backend (1 min)
1. Click **New → Web Service**
2. Select your `teacher-job-portal` repo
3. Fill in:
   - **Name**: `teacher-job-portal-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Click **Advanced** → **Add Environment Variable**
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `generate-random-string-here`
   - `DB_SSL` = `false`
   - `FRONTEND_URL` = `teacher-portal.vercel.app` (update later after deploying frontend)

5. Click **Create Web Service** (deployment starts automatically)
6. **Copy your backend URL** once it's done (like `https://teacher-job-portal-backend.onrender.com`)

### Step 4: Deploy Database (1 min)
1. In Render dashboard → **New → PostgreSQL**
2. Fill in:
   - **Name**: `teacher-portal-db`
   - **Plan**: Free
3. Click **Create**
4. **Copy the connection string**
5. Go back to your backend service → **Environment**
6. Add: `DATABASE_URL` = (paste the connection string)
7. **Redeploy** your backend

### Step 5: Deploy Frontend (1 min) - Choose ONE:

#### Option A: Vercel (Easier)
1. Go to **[vercel.com](https://vercel.com)**
2. Click **Add New → Project**
3. Import your GitHub repo
4. **Root Directory**: `./frontend`
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://teacher-job-portal-backend.onrender.com/api`
6. Click **Deploy**
7. **Copy your frontend URL**

#### Option B: Render (If you prefer one platform)
1. In Render → **New → Web Service**
2. Select your repo again
3. Fill in:
   - **Name**: `teacher-job-portal-frontend`
   - **Build Command**: `npm run build --prefix frontend`
   - **Start Command**: `cd frontend && npm start`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://teacher-job-portal-backend.onrender.com/api`
5. Click **Create Web Service**

---

## 🎉 You're Live!

Once everything deploys (takes 2-3 minutes):

1. **On Android**: Open Chrome/Firefox
2. **Go to**: Your frontend URL (e.g., `https://teacher-portal.vercel.app`)
3. **Done!** The app works on Android just like localhost

---

## 🔗 What You Have Now

| Component | URL | Type |
|-----------|-----|------|
| Frontend | `https://teacher-portal.vercel.app` | Your web app |
| Backend | `https://teacher-job-portal-backend.onrender.com` | Your API |
| Database | PostgreSQL on Render | Your data |

---

## ⚠️ Important: Update CORS After Frontend Deploys

1. Go to Render → Select `teacher-job-portal-backend`
2. Go to **Environment**
3. Update `FRONTEND_URL` to your actual frontend URL
4. **Redeploy** the backend

---

## 📱 Testing on Android

```
1. Get your Android phone
2. Connect to WiFi (same internet as your computer, or any internet)
3. Open Chrome
4. Type: https://your-frontend-url.com
5. Test:
   - Create account
   - Post a job
   - Search jobs
   - Apply to jobs
```

---

## 🛠 Troubleshooting

**Still getting "Cannot reach API" on Android?**
- [ ] Check your frontend's `NEXT_PUBLIC_API_URL` is correct
- [ ] Check backend `FRONTEND_URL` matches your frontend domain
- [ ] Check backend is actually running (visit backend URL, should see JSON)
- [ ] Wait 2-3 minutes after redeploy

**Database not connecting?**
- [ ] Go to Render PostgreSQL dashboard → check "Connections"
- [ ] Copy connection string exactly as shown
- [ ] Redeploy backend after updating DATABASE_URL

---

## 💰 Cost

- **Render**: Free (750 hours compute/month = free for small project)
- **Vercel**: Free (limited to 6GB/month)
- **Database**: Free on Render

**Total cost to go live: $0** 🎉

---

## ✅ You're Done!

Your app is now:
- ✅ Accessible from Android
- ✅ Accessible from any device, anywhere
- ✅ Running on cloud (not your laptop)
- ✅ Ready to share with others

**Enjoy your live app!** 🚀
