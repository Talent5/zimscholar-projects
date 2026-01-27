# Deployment Guide for ScholarXafrica
## Domain: https://scholarxafrica.dev/

This guide covers deploying both the backend API and frontend applications to production.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Admin Panel Deployment](#admin-panel-deployment)
5. [Domain Configuration](#domain-configuration)
6. [Environment Variables](#environment-variables)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Services
- [ ] **MongoDB Database** (MongoDB Atlas recommended)
- [ ] **Email Service** (Gmail with App Password or SendGrid)
- [ ] **Supabase Account** (for file storage)
- [ ] **Domain Name** - scholarxafrica.dev
- [ ] **Hosting Platform** (Choose one):
  - VPS (DigitalOcean, Linode, AWS EC2)
  - PaaS (Heroku, Railway, Render)
  - Vercel/Netlify (Frontend) + Backend hosting separately

### Required Tools
- Node.js 18+ and npm/yarn
- Git
- PM2 (for Node.js process management)
- Nginx (if using VPS)
- SSL Certificate (Let's Encrypt recommended)

---

## 🚀 Backend Deployment

### Option 1: VPS Deployment (Recommended for Production)

#### Step 1: Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install MongoDB (if self-hosting) or use MongoDB Atlas
# For MongoDB Atlas, skip this step and use the connection string
```

#### Step 2: Clone and Setup Backend
```bash
# Create app directory
sudo mkdir -p /var/www/scholarxafrica
cd /var/www/scholarxafrica

# Clone repository
git clone https://github.com/Talent5/zimscholar-projects.git .

# Navigate to backend
cd backend

# Install dependencies
npm install --production

# Create production .env file
sudo nano .env
# Copy content from backend/.env.production template
```

#### Step 3: Configure Environment Variables
Create `/var/www/scholarxafrica/backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scholarxafrica?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$YourHashedPasswordHere

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@scholarxafrica.dev
EMAIL_PASSWORD=your-app-specific-password
ADMIN_EMAIL=admin@scholarxafrica.dev
ADMIN_DASHBOARD_URL=https://scholarxafrica.dev/admin

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Gemini API (Optional)
GEMINI_API_KEY=your-gemini-api-key

# CORS Configuration
ALLOWED_ORIGINS=https://scholarxafrica.dev,https://www.scholarxafrica.dev
```

#### Step 4: Start Backend with PM2
```bash
# Start the backend
pm2 start server.js --name "scholarxafrica-backend"

# Configure PM2 to restart on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs scholarxafrica-backend

# Monitor
pm2 monit
```

#### Step 5: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/scholarxafrica`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.scholarxafrica.dev;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (if not handled by backend)
        add_header 'Access-Control-Allow-Origin' 'https://scholarxafrica.dev' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization' always;
        
        # Increase timeout for long operations
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/scholarxafrica /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 6: Setup SSL Certificate
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.scholarxafrica.dev

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option 2: Platform as a Service (PaaS)

#### Render.com Deployment
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: scholarxafrica-backend
   - **Environment**: Node
   - **Region**: Choose closest to users
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (from .env.production)
6. Click "Create Web Service"

#### Railway.app Deployment
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy backend
cd backend
railway up
```

---

## 🎨 Frontend Deployment

### Step 1: Build Frontend Applications

#### Main Frontend Build
```bash
# From project root
cd /var/www/scholarxafrica

# Create production .env
cat > .env.production << EOF
VITE_API_URL=https://api.scholarxafrica.dev
VITE_APP_NAME=ScholarXafrica
EOF

# Install dependencies
npm install

# Build for production
npm run build
# Output will be in: dist/
```

#### Admin Panel Build
```bash
# Navigate to admin folder
cd admin

# Create production .env
cat > .env.production << EOF
VITE_API_URL=https://api.scholarxafrica.dev
EOF

# Install dependencies
npm install

# Build for production
npm run build
# Output will be in: admin/dist/
```

### Step 2: Deploy to Vercel (Recommended for Frontend)

#### Main Site Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy main site
cd /var/www/scholarxafrica
vercel --prod

# Follow prompts:
# - Set output directory: dist
# - Set environment variable: VITE_API_URL=https://api.scholarxafrica.dev
```

#### Admin Panel Deployment
```bash
# Deploy admin panel
cd admin
vercel --prod

# Configure to deploy to scholarxafrica.dev/admin or admin.scholarxafrica.dev
```

#### Vercel Configuration
Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api.scholarxafrica.dev"
  }
}
```

### Step 3: VPS Deployment (Alternative)

#### Configure Nginx for Frontend
Add to `/etc/nginx/sites-available/scholarxafrica`:
```nginx
# Main Frontend
server {
    listen 80;
    listen [::]:80;
    server_name scholarxafrica.dev www.scholarxafrica.dev;

    root /var/www/scholarxafrica/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Main site - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Admin panel
    location /admin {
        alias /var/www/scholarxafrica/admin/dist;
        try_files $uri $uri/ /admin/index.html;
        
        location ~* /admin/.*\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Setup SSL:
```bash
sudo certbot --nginx -d scholarxafrica.dev -d www.scholarxafrica.dev
```

---

## 🔧 Domain Configuration

### DNS Settings
Configure these DNS records at your domain registrar:

```
Type    Name    Value                           TTL
A       @       your-server-ip                  3600
A       www     your-server-ip                  3600
A       api     your-server-ip                  3600
CNAME   admin   scholarxafrica.dev              3600
```

If using Vercel for frontend:
```
Type    Name    Value                           TTL
CNAME   @       cname.vercel-dns.com            3600
CNAME   www     cname.vercel-dns.com            3600
A       api     your-backend-server-ip          3600
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hashed-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@scholarxafrica.dev
EMAIL_PASSWORD=app-password
ADMIN_EMAIL=admin@scholarxafrica.dev
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-key
ALLOWED_ORIGINS=https://scholarxafrica.dev
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.scholarxafrica.dev
VITE_APP_NAME=ScholarXafrica
```

### Admin Panel (.env.production)
```env
VITE_API_URL=https://api.scholarxafrica.dev
```

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secret (min 32 characters)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL for all domains
- [ ] Configure CORS properly
- [ ] Set up firewall rules (UFW)
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Implement monitoring and alerts

---

## 📊 Monitoring & Maintenance

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs scholarxafrica-backend

# Restart application
pm2 restart scholarxafrica-backend

# Stop application
pm2 stop scholarxafrica-backend

# Monitor resources
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Database Backup
```bash
# MongoDB backup (if self-hosted)
mongodump --uri="mongodb://localhost:27017/scholarxafrica" --out=/backup/$(date +%Y%m%d)

# For MongoDB Atlas, use automated backups in dashboard
```

### Application Updates
```bash
# Pull latest code
cd /var/www/scholarxafrica
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart scholarxafrica-backend

# Update frontend
cd ..
npm install
npm run build

# Update admin
cd admin
npm install
npm run build
```

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check PM2 logs
pm2 logs scholarxafrica-backend --lines 100

# Check if port is in use
sudo lsof -i :5000

# Test backend directly
cd /var/www/scholarxafrica/backend
node server.js
```

### Database connection issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### CORS errors
- Verify ALLOWED_ORIGINS in backend .env
- Check Nginx configuration
- Verify frontend VITE_API_URL

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## 📞 Support Resources

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
- **Let's Encrypt**: https://letsencrypt.org
- **PM2 Docs**: https://pm2.keymetrics.io

---

## 🚀 Quick Deployment Checklist

### Before Deployment
- [ ] Test application locally
- [ ] Set up MongoDB database
- [ ] Configure email service
- [ ] Set up Supabase storage
- [ ] Prepare environment variables
- [ ] Domain DNS configured

### Deployment Steps
- [ ] Deploy backend to server/PaaS
- [ ] Configure environment variables
- [ ] Set up PM2/process manager
- [ ] Configure Nginx/reverse proxy
- [ ] Setup SSL certificates
- [ ] Build and deploy frontend
- [ ] Build and deploy admin panel
- [ ] Test all functionality
- [ ] Monitor logs for errors

### Post-Deployment
- [ ] Verify all pages load correctly
- [ ] Test form submissions
- [ ] Test admin login and dashboard
- [ ] Check email notifications
- [ ] Verify file uploads work
- [ ] Monitor performance
- [ ] Set up automated backups
- [ ] Document any custom configurations

---

## 📝 Notes

- This guide assumes Ubuntu/Debian server for VPS deployment
- Adjust commands for other Linux distributions as needed
- Keep backup copies of all configuration files
- Document any custom modifications
- Regular security audits recommended
- Monitor application logs regularly

**Need help?** Refer to the troubleshooting section or check application logs for specific errors.
