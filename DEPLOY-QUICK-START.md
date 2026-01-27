# 🚀 Quick Start: Deploy to Render + Cloudflare

**Backend**: Render  
**Frontend**: Cloudflare Pages  
**Domain**: scholarxafrica.dev

---

## ⚡ 5-Minute Setup

### 1️⃣ Backend (Render) - 2 minutes

1. **Go to**: https://render.com → Sign in with GitHub
2. **Click**: New + → Web Service
3. **Select**: `Talent5/zimscholar-projects`
4. **Configure**:
   - Name: `scholarxafrica-backend`
   - Root Directory: `backend`
   - Build Command: `npm install --production`
   - Start Command: `node server.js`
5. **Add Environment Variables** (click "Add from .env"):
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-32-char-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your-hashed-password
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL=admin@scholarxafrica.dev
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-supabase-key
   ALLOWED_ORIGINS=https://scholarxafrica.dev
   ```
6. **Click**: Create Web Service
7. **Copy URL**: `https://your-app.onrender.com` (you'll need this!)

### 2️⃣ Frontend (Cloudflare Pages) - 3 minutes

1. **Go to**: https://dash.cloudflare.com → Workers & Pages → Pages
2. **Click**: Create application → Connect to Git
3. **Select**: `Talent5/zimscholar-projects`
4. **Configure**:
   - Build command: `npm install && npm run build:prod`
   - Build output: `dist`
   - Root directory: (leave empty)
5. **Environment Variables**:
   ```
   NODE_VERSION=20
   VITE_API_URL=https://your-app.onrender.com
   VITE_APP_NAME=ScholarXafrica
   ```
6. **Click**: Save and Deploy
7. **Wait**: ~3 minutes for build
8. **Add Custom Domain**: 
   - Custom domains → Set up
   - Enter: `scholarxafrica.dev`
   - Follow DNS instructions

### 3️⃣ Update Backend CORS

Go back to Render → Environment → Update:
```
ALLOWED_ORIGINS=https://scholarxafrica.dev,https://www.scholarxafrica.dev
```

Click "Save" → Service will auto-redeploy

---

## ✅ Verify Deployment

```bash
# Test backend
curl https://your-app.onrender.com/api/health

# Test frontend
curl https://scholarxafrica.dev
```

Visit in browser:
- Main site: https://scholarxafrica.dev
- Admin panel: https://scholarxafrica.dev/admin

---

## 🔧 Generate Credentials Fast

**Windows PowerShell:**
```powershell
# JWT Secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Hash password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(console.log)"
```

**Or use helper:**
```powershell
.\deploy-helper.ps1
```

---

## 📋 Need More Details?

See **[DEPLOY-RENDER-CLOUDFLARE.md](DEPLOY-RENDER-CLOUDFLARE.md)** for:
- Detailed step-by-step instructions
- Troubleshooting guide
- Admin panel setup
- Custom domain configuration
- Monitoring setup

---

## 💰 Costs

- **Render Free**: Backend sleeps after 15 min (cold starts)
- **Render Paid**: $7/month - always on, no sleep
- **Cloudflare**: Free unlimited bandwidth & requests

**Recommended for production**: Render Starter ($7/month) + Cloudflare Free

---

## 🆘 Quick Fixes

**Backend not connecting to DB?**
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Frontend can't reach API?**
- Verify `VITE_API_URL` in Cloudflare matches Render URL
- Check `ALLOWED_ORIGINS` in Render includes your domain

**Admin panel 404?**
- Update build command to include admin:
  ```bash
  npm install && npm run build:cloudflare
  ```

---

**That's it!** 🎉 Your app is live at https://scholarxafrica.dev
