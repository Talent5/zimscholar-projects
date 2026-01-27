# 🚀 Deployment Files Overview

This directory contains all the necessary configuration files for deploying ScholarXafrica to production at **https://scholarxafrica.dev/**

## 📁 Files Structure

### Documentation
- **DEPLOYMENT-GUIDE.md** - Comprehensive deployment guide with detailed instructions
- **QUICK-DEPLOY.md** - Quick reference guide for fast deployment
- **DEPLOYMENT-CHECKLIST.md** - Step-by-step checklist to ensure nothing is missed

### Environment Configuration
- **backend/.env.production** - Backend environment variables template
- **.env.production** - Frontend environment variables template
- **admin/.env.production** - Admin panel environment variables template

### Docker Configuration
- **backend/Dockerfile** - Backend container configuration
- **backend/.dockerignore** - Files to exclude from Docker image
- **docker-compose.yml** - Multi-container orchestration

### Nginx Configuration
- **nginx/nginx.conf** - Main Nginx configuration
- **nginx/conf.d/scholarxafrica.conf** - Site-specific configuration

### CI/CD
- **.github/workflows/deploy.yml** - Automated deployment workflow
- **.github/workflows/ci.yml** - Continuous integration workflow

### Helper Scripts
- **deploy-helper.sh** - Bash script for Linux/Mac deployment setup
- **deploy-helper.ps1** - PowerShell script for Windows deployment setup

### Deployment Configuration
- **vercel.json** - Vercel deployment configuration

## 🎯 Quick Start

### 1. Choose Your Deployment Method

#### Option A: VPS (Full Control)
- Best for: Custom infrastructure, full control
- Cost: ~$5-20/month
- Setup time: 1-2 hours
- Follow: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) → VPS Section

#### Option B: Vercel + PaaS (Easy)
- Best for: Quick deployment, minimal maintenance
- Cost: Free tier available, ~$20-50/month for premium
- Setup time: 30 minutes
- Follow: [QUICK-DEPLOY.md](QUICK-DEPLOY.md) → Option B

#### Option C: Docker (Portable)
- Best for: Consistent environments, easy scaling
- Cost: Depends on hosting
- Setup time: 1 hour
- Follow: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) → Docker Section

### 2. Prepare Prerequisites

Run the helper script to set up environment files:

**Linux/Mac:**
```bash
chmod +x deploy-helper.sh
./deploy-helper.sh
```

**Windows:**
```powershell
.\deploy-helper.ps1
```

### 3. Follow the Checklist

Use [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) to ensure you complete all steps.

## 📋 Environment Variables Required

### Backend Essentials
```env
MONGODB_URI=         # MongoDB Atlas connection string
JWT_SECRET=          # 32+ character random string
ADMIN_PASSWORD_HASH= # Bcrypt hash of admin password
EMAIL_USER=          # Email for sending notifications
EMAIL_PASSWORD=      # Email app password
SUPABASE_URL=        # Supabase project URL
SUPABASE_SERVICE_KEY=# Supabase service role key
```

### Frontend Essentials
```env
VITE_API_URL=        # Backend API URL
```

## 🛠️ Common Commands

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Start admin
cd admin && npm run dev
```

### Production Build
```bash
# Build frontend
npm run build:prod

# Build admin
cd admin && npm run build

# Start backend (production)
cd backend && npm start
```

### Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### PM2 (VPS)
```bash
# Start backend
npm run pm2:start

# View logs
npm run pm2:logs

# Restart
npm run pm2:restart
```

## 🔐 Security Notes

1. **Never commit .env files** - They're in .gitignore for a reason
2. **Use strong passwords** - Minimum 12 characters, mixed case, numbers, symbols
3. **Rotate secrets regularly** - Change JWT_SECRET, passwords periodically
4. **Enable 2FA** - On all services (MongoDB, Supabase, domain registrar)
5. **Restrict database access** - Use IP whitelisting in MongoDB Atlas
6. **Keep dependencies updated** - Run `npm audit` regularly

## 📞 Support & Resources

### Documentation
- [Deployment Guide](DEPLOYMENT-GUIDE.md) - Full detailed guide
- [Quick Deploy](QUICK-DEPLOY.md) - Fast reference
- [Checklist](DEPLOYMENT-CHECKLIST.md) - Step-by-step verification

### External Resources
- MongoDB Atlas: https://cloud.mongodb.com
- Supabase: https://supabase.com
- Vercel: https://vercel.com
- Render: https://render.com
- DigitalOcean: https://digitalocean.com

### CI/CD
- GitHub Actions workflows in `.github/workflows/`
- Automatic deployment on push to `main` branch
- Health checks after deployment

## 🧪 Testing Deployment

After deployment, verify:

```bash
# Test backend health
curl https://api.scholarxafrica.dev/api/health

# Test frontend
curl https://scholarxafrica.dev

# Test admin
curl https://scholarxafrica.dev/admin
```

## 🔄 Updates & Maintenance

### Updating the Application

**VPS:**
```bash
cd /var/www/scholarxafrica
git pull origin main
cd backend && npm install && pm2 restart scholarxafrica-backend
cd .. && npm install && npm run build:prod
cd admin && npm install && npm run build
```

**Vercel:**
```bash
git push origin main  # Auto-deploys
```

**Docker:**
```bash
docker-compose down
git pull origin main
docker-compose up -d --build
```

## 📊 Monitoring

### Logs Location

**VPS:**
- Backend logs: `pm2 logs scholarxafrica-backend`
- Nginx access: `/var/log/nginx/access.log`
- Nginx errors: `/var/log/nginx/error.log`

**Docker:**
- Backend logs: `docker-compose logs backend`
- All logs: `docker-compose logs`

### Health Checks
- Backend: `https://api.scholarxafrica.dev/api/health`
- Response should be: `{"status":"ok","message":"Server is running"}`

## 🚨 Troubleshooting

### Backend won't start
1. Check logs: `pm2 logs scholarxafrica-backend`
2. Verify .env file exists and is complete
3. Test MongoDB connection
4. Check port 5000 is available

### Frontend shows API errors
1. Verify VITE_API_URL is correct
2. Check CORS settings in backend
3. Verify backend is running
4. Check browser console for errors

### SSL certificate issues
1. Verify domain DNS is correct
2. Run: `sudo certbot certificates`
3. Renew if needed: `sudo certbot renew`

## 📝 Notes

- Default admin username: `admin`
- Change default credentials immediately after deployment
- Keep backup of .env files in secure location (not in git)
- Monitor disk space and database usage
- Set up automated backups

## ✅ Deployment Verification

After deployment, ensure:
- [ ] Site accessible at https://scholarxafrica.dev
- [ ] Admin accessible at https://scholarxafrica.dev/admin
- [ ] All forms submit successfully
- [ ] Email notifications working
- [ ] File uploads functioning
- [ ] SSL certificate valid
- [ ] No console errors

---

**Ready to deploy?** Start with [QUICK-DEPLOY.md](QUICK-DEPLOY.md) for the fastest path, or [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for comprehensive instructions.

Good luck! 🚀
