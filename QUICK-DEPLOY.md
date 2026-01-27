# Quick Deployment Steps for scholarxafrica.dev

## Prerequisites Setup

### 1. MongoDB Atlas
1. Sign up at https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string: `mongodb+srv://...`

### 2. Supabase Storage
1. Sign up at https://supabase.com
2. Create new project
3. Go to Settings → API
4. Copy:
   - Project URL
   - Service role key (keep secret!)
5. Create buckets in Storage:
   - `portfolio-images`
   - `service-images`
   - `quotations`

### 3. Email Service (Gmail)
1. Enable 2FA on Gmail account
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Create app password
   - Save the 16-character password

### 4. Domain Configuration
Update DNS records at your domain registrar:
```
A       @       your-server-ip
A       www     your-server-ip
A       api     your-server-ip
```

---

## Option A: VPS Deployment (DigitalOcean, Linode, etc.)

### Server Setup
```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Install Node.js, PM2, Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# 3. Clone repository
sudo mkdir -p /var/www/scholarxafrica
cd /var/www/scholarxafrica
git clone https://github.com/Talent5/zimscholar-projects.git .

# 4. Setup backend
cd backend
npm install --production
cp .env.production .env
nano .env  # Fill in your actual values

# 5. Start backend with PM2
pm2 start server.js --name scholarxafrica-backend
pm2 startup
pm2 save

# 6. Build frontend
cd ..
cp .env.production .env.production.local
nano .env.production.local  # Update VITE_API_URL
npm install
npm run build:prod

# 7. Build admin
cd admin
cp .env.production .env.production.local
nano .env.production.local  # Update VITE_API_URL
npm install
npm run build

# 8. Configure Nginx
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/conf.d/scholarxafrica.conf /etc/nginx/sites-available/scholarxafrica
sudo ln -s /etc/nginx/sites-available/scholarxafrica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Setup SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d scholarxafrica.dev -d www.scholarxafrica.dev -d api.scholarxafrica.dev
```

---

## Option B: Vercel (Frontend) + Render/Railway (Backend)

### Deploy Backend to Render.com
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: scholarxafrica-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables from `.env.production`
6. Click "Create Web Service"
7. Copy the provided URL (e.g., `https://scholarxafrica-backend.onrender.com`)

### Deploy Frontend to Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy main site
cd /path/to/zimscholar-projects
vercel --prod

# During setup:
# - Project name: scholarxafrica
# - Output directory: dist
# - Add environment variable: VITE_API_URL=https://your-backend-url

# 4. Configure custom domain
# In Vercel dashboard: Settings → Domains
# Add: scholarxafrica.dev
```

---

## Option C: Docker Deployment

### Using Docker Compose
```bash
# 1. Clone repository
git clone https://github.com/Talent5/zimscholar-projects.git
cd zimscholar-projects

# 2. Configure environment
cp backend/.env.production backend/.env
nano backend/.env  # Fill in your values

# 3. Build frontend
cp .env.production .env.production.local
nano .env.production.local
npm install && npm run build:prod

cd admin
npm install && npm run build
cd ..

# 4. Update docker-compose.yml
# Comment out mongodb service if using MongoDB Atlas

# 5. Start services
docker-compose up -d

# 6. View logs
docker-compose logs -f backend

# 7. Setup SSL with Certbot
sudo certbot --nginx -d scholarxafrica.dev
```

---

## Post-Deployment Checklist

### Test Everything
```bash
# Test backend health
curl https://api.scholarxafrica.dev/api/health

# Test frontend
curl https://scholarxafrica.dev
```

### Verify Functionality
- [ ] Main site loads correctly
- [ ] Admin panel accessible at `/admin`
- [ ] Admin login works
- [ ] Forms submit successfully
- [ ] Email notifications received
- [ ] File uploads work (portfolio, quotations)
- [ ] All pages navigate correctly

### Seed Initial Data
```bash
# SSH into backend server or use Render/Railway shell
cd backend

# Seed services
npm run seed:services

# Seed pricing packages
npm run seed:pricing

# Or seed all at once
npm run seed:all
```

### Security Checklist
- [ ] Change default admin password
- [ ] Update JWT_SECRET to a secure random string
- [ ] Configure CORS origins correctly
- [ ] Enable SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular backups configured

---

## Environment Variables Reference

### Backend Required Variables
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-32-char-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=noreply@scholarxafrica.dev
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@scholarxafrica.dev
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-key
ALLOWED_ORIGINS=https://scholarxafrica.dev
```

### Frontend Required Variables
```env
VITE_API_URL=https://api.scholarxafrica.dev
```

---

## Common Issues & Solutions

### Backend won't start
```bash
# Check logs
pm2 logs scholarxafrica-backend

# Check if port in use
sudo lsof -i :5000

# Test manually
cd backend && node server.js
```

### Database connection fails
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (use `0.0.0.0/0` for all IPs)
- Test connection: `mongosh "your-mongodb-uri"`

### CORS errors
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check `VITE_API_URL` in frontend matches backend URL
- Ensure Nginx CORS headers are configured

### SSL certificate issues
```bash
# Renew certificates
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Useful Commands

### PM2
```bash
pm2 status                          # View status
pm2 logs scholarxafrica-backend     # View logs
pm2 restart scholarxafrica-backend  # Restart
pm2 monit                           # Monitor
```

### Nginx
```bash
sudo nginx -t                       # Test config
sudo systemctl reload nginx         # Reload
sudo tail -f /var/log/nginx/error.log  # View errors
```

### Docker
```bash
docker-compose ps                   # View status
docker-compose logs -f backend      # View logs
docker-compose restart backend      # Restart service
docker-compose down && docker-compose up -d  # Full restart
```

---

## Update/Redeploy Process

### VPS
```bash
cd /var/www/scholarxafrica
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart scholarxafrica-backend

# Update frontend
cd ..
npm install && npm run build:prod

cd admin
npm install && npm run build
```

### Vercel
```bash
# Push to GitHub main branch
git push origin main
# Vercel auto-deploys
```

### Render
```bash
# Push to GitHub main branch
git push origin main
# Render auto-deploys
```

---

## Support & Documentation

- Full Guide: `DEPLOYMENT-GUIDE.md`
- Environment Templates: `.env.production` files
- Docker Setup: `docker-compose.yml`
- Nginx Config: `nginx/` directory
- CI/CD: `.github/workflows/`

**Need help?** Check the main `DEPLOYMENT-GUIDE.md` for detailed troubleshooting.
