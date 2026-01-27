# Quick Deployment Guide - Render + Cloudflare Pages

## 🚀 Deploy to scholarxafrica.dev

This guide covers deploying:
- **Backend** → Render (https://your-app.onrender.com)
- **Frontend** → Cloudflare Pages (https://scholarxafrica.dev)

---

## Part 1: Deploy Backend to Render

### Step 1: Prerequisites
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account and connection string
- [ ] Supabase account and API keys
- [ ] Gmail app password for email notifications

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

### Step 3: Deploy Backend

#### Option A: Using render.yaml (Recommended)
1. Push the `render.yaml` file to your repository
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your repository: `Talent5/zimscholar-projects`
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

#### Option B: Manual Setup
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect repository: `Talent5/zimscholar-projects`
3. Configure:
   - **Name**: `scholarxafrica-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### Step 4: Configure Environment Variables

In Render Dashboard → Service → Environment:

**Required Variables:**
```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/scholarxafrica
JWT_SECRET = your-32-character-secret-here
ADMIN_USERNAME = admin
ADMIN_PASSWORD_HASH = $2a$10$your-hashed-password-here
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = noreply@scholarxafrica.dev
EMAIL_PASSWORD = your-gmail-app-password
ADMIN_EMAIL = admin@scholarxafrica.dev
ADMIN_DASHBOARD_URL = https://scholarxafrica.dev/admin
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_KEY = your-supabase-service-key
ALLOWED_ORIGINS = https://scholarxafrica.dev,https://www.scholarxafrica.dev
```

**Generate Secure Credentials:**
```powershell
# Run the helper script
.\deploy-helper.ps1

# Or manually:
# JWT Secret (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Hash Password (Node.js)
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10).then(console.log)"
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (~2-5 minutes)
3. Copy your Render URL: `https://scholarxafrica-backend.onrender.com`

### Step 6: Verify Backend
```bash
# Test health endpoint
curl https://scholarxafrica-backend.onrender.com/api/health

# Expected response:
{"status":"ok","message":"Server is running"}
```

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Create Cloudflare Account
1. Go to https://dash.cloudflare.com
2. Sign up or log in
3. Go to **"Workers & Pages"** → **"Pages"**

### Step 2: Connect Repository
1. Click **"Create application"** → **"Pages"**
2. Click **"Connect to Git"**
3. Authorize Cloudflare to access GitHub
4. Select repository: `Talent5/zimscholar-projects`

### Step 3: Configure Build Settings

**Framework preset**: None (or Vite)

**Build configuration:**
```
Root Directory: (leave empty)
Build command: npm install && npm run build:prod
Build output directory: dist
```

**Advanced settings:**

Build environment variables:
```
NODE_VERSION = 20
VITE_API_URL = https://scholarxafrica-backend.onrender.com
VITE_APP_NAME = ScholarXafrica
```

### Step 4: Deploy
1. Click **"Save and Deploy"**
2. Wait for build (~3-5 minutes)
3. You'll get a URL like: `https://zimscholar-projects.pages.dev`

### Step 5: Configure Custom Domain

#### Add Domain to Cloudflare Pages
1. In your Pages project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter: `scholarxafrica.dev`
4. Click **"Continue"**

#### Update DNS (if domain is managed elsewhere)
If your domain is NOT on Cloudflare DNS:
1. Go to your domain registrar
2. Add these DNS records:
```
Type    Name    Value                           TTL
CNAME   @       zimscholar-projects.pages.dev   Auto
CNAME   www     zimscholar-projects.pages.dev   Auto
```

#### Update DNS (if domain is on Cloudflare)
Cloudflare will automatically configure DNS for you.

### Step 6: Add Admin Panel to Deployment

The admin panel needs to be included in the build. Update build settings:

**Option A: Single Build (Recommended)**
Build both in one deployment by updating your build command:

1. Go to Pages project → **Settings** → **Builds & deployments**
2. Update **Build command**:
```bash
npm install && npm run build:prod && cd admin && npm install && npm run build && mkdir -p ../dist/admin && cp -r dist/* ../dist/admin/
```

**Option B: Separate Deployment**
Create a second Pages project for admin panel:
1. Repeat Cloudflare Pages setup
2. Configure:
   - Root Directory: `admin`
   - Build command: `npm install && npm run build`
   - Build output: `dist`
3. Set up custom domain: `admin.scholarxafrica.dev`

### Step 7: Verify Frontend
1. Visit: https://scholarxafrica.dev
2. Test admin: https://scholarxafrica.dev/admin
3. Test all pages and forms

---

## Part 3: Connect Backend and Frontend

### Update CORS on Backend (Render)

In Render Dashboard → Environment:
```
ALLOWED_ORIGINS = https://scholarxafrica.dev,https://www.scholarxafrica.dev,https://zimscholar-projects.pages.dev
```

Save and redeploy.

### Update API URL on Frontend (Cloudflare)

In Cloudflare Pages → Settings → Environment variables:
```
VITE_API_URL = https://scholarxafrica-backend.onrender.com
```

Trigger a new deployment to apply changes.

---

## Part 4: Post-Deployment Setup

### 1. Seed Database
Use Render Shell or local connection:

```bash
# Option A: Render Shell (in Render Dashboard → Shell)
cd backend
npm run seed:services
npm run seed:pricing

# Option B: Local with production DB
# Update backend/.env with production MONGODB_URI
cd backend
npm run seed:services
npm run seed:pricing
```

### 2. Test Complete Flow
- [ ] Main site loads: https://scholarxafrica.dev
- [ ] Admin login works: https://scholarxafrica.dev/admin
- [ ] Contact form submits
- [ ] Quote request form submits
- [ ] Project request form submits
- [ ] Email notifications received
- [ ] File uploads work (test portfolio/quotations)

### 3. Configure Custom Domain SSL
Cloudflare automatically provisions SSL. Verify:
1. Visit https://scholarxafrica.dev
2. Check for 🔒 lock icon
3. View certificate details

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           scholarxafrica.dev                │
│       (Cloudflare Pages - Frontend)         │
│                                             │
│  ┌────────────┐      ┌──────────────┐     │
│  │   Main     │      │    Admin     │     │
│  │   Site     │      │    Panel     │     │
│  └────────────┘      └──────────────┘     │
└──────────────┬──────────────────────────────┘
               │
               │ API Requests
               ▼
┌──────────────────────────────────────────────┐
│   scholarxafrica-backend.onrender.com        │
│         (Render - Backend API)               │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │      Express.js Server               │  │
│  │  - REST API                          │  │
│  │  - Authentication                    │  │
│  │  - File handling                     │  │
│  └──────────────────────────────────────┘  │
└──────┬──────────┬────────────┬──────────────┘
       │          │            │
       ▼          ▼            ▼
   ┌────────┐ ┌────────┐ ┌──────────┐
   │MongoDB │ │Supabase│ │  Gmail   │
   │ Atlas  │ │Storage │ │   SMTP   │
   └────────┘ └────────┘ └──────────┘
```

---

## Automatic Deployments

### Render Auto-Deploy
- Automatically deploys when you push to `main` branch
- Configure in: Render Dashboard → Service → Settings → Auto-Deploy

### Cloudflare Pages Auto-Deploy
- Automatically deploys when you push to `main` branch
- Configure in: Pages Project → Settings → Builds & deployments

### Disable Auto-Deploy (Optional)
If you want manual control:
- **Render**: Settings → Auto-Deploy → Disable
- **Cloudflare**: Settings → Builds → Production branch → None

---

## Monitoring & Logs

### Render Logs
1. Dashboard → Service → Logs
2. View real-time logs
3. Filter by severity

### Cloudflare Pages Logs
1. Pages Project → Deployments
2. Click on any deployment
3. View build logs

### Set Up Monitoring (Optional)
- **UptimeRobot**: Free uptime monitoring
- **Sentry**: Error tracking (add to frontend/backend)
- **LogRocket**: Session replay (add to frontend)

---

## Costs

### Render
- **Free Tier**: 
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - Slower cold starts
- **Starter**: $7/month
  - Always on
  - No sleep
  - Better performance

### Cloudflare Pages
- **Free Tier**:
  - Unlimited requests
  - Unlimited bandwidth
  - 500 builds/month
- **Pro**: $20/month
  - More builds
  - Analytics
  - Advanced features

**Total Free**: $0/month
**Total Paid** (if needed): $7-27/month

---

## Troubleshooting

### Backend Issues

**Service won't start:**
1. Check Render logs for errors
2. Verify environment variables are set
3. Test MongoDB connection string locally
4. Check Node.js version compatibility

**Database connection fails:**
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Test connection string locally
3. Check database user permissions

**CORS errors:**
1. Verify `ALLOWED_ORIGINS` includes Cloudflare Pages URL
2. Check frontend is using correct API URL
3. Look for typos in domains

### Frontend Issues

**Build fails:**
1. Check build logs in Cloudflare
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are listed
4. Try building locally first

**API requests fail:**
1. Verify `VITE_API_URL` is set correctly
2. Check backend is running (test health endpoint)
3. Check browser console for CORS errors
4. Verify backend CORS settings

**Admin panel 404:**
1. Ensure admin build is included
2. Check `_redirects` or routing configuration
3. Verify build output includes admin folder

---

## Updates & Redeployment

### Update Backend
```bash
# Make changes to backend code
git add .
git commit -m "Update backend"
git push origin main

# Render auto-deploys (or trigger manually in dashboard)
```

### Update Frontend
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push origin main

# Cloudflare auto-deploys (or trigger manually in dashboard)
```

### Manual Trigger
- **Render**: Dashboard → Service → Manual Deploy → Deploy
- **Cloudflare**: Pages Project → Deployments → Retry deployment

---

## Security Checklist

- [ ] Change default admin password
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] Supabase Row Level Security enabled
- [ ] Gmail App Password used (not regular password)
- [ ] HTTPS enabled on custom domain
- [ ] CORS properly configured
- [ ] Environment variables are secrets (not in code)
- [ ] Regular dependency updates (`npm audit`)

---

## Quick Reference

**Backend URL**: https://scholarxafrica-backend.onrender.com
**Frontend URL**: https://scholarxafrica.dev
**Admin Panel**: https://scholarxafrica.dev/admin

**Render Dashboard**: https://dashboard.render.com
**Cloudflare Dashboard**: https://dash.cloudflare.com

**Support**:
- Render Docs: https://render.com/docs
- Cloudflare Docs: https://developers.cloudflare.com/pages
- MongoDB Atlas: https://cloud.mongodb.com
- Supabase: https://supabase.com/docs

---

**Need help?** Check the troubleshooting section or review logs in respective dashboards.

Good luck with your deployment! 🚀
