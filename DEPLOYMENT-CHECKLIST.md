# Deployment Checklist for scholarxafrica.dev

## Pre-Deployment Setup

### 1. Services Setup
- [ ] **MongoDB Atlas**
  - [ ] Create cluster
  - [ ] Create database user
  - [ ] Whitelist IP addresses (0.0.0.0/0 or specific IPs)
  - [ ] Get connection string
  - [ ] Test connection

- [ ] **Supabase Storage**
  - [ ] Create project
  - [ ] Copy Project URL
  - [ ] Copy Service Role Key
  - [ ] Create storage buckets:
    - [ ] `portfolio-images`
    - [ ] `service-images`
    - [ ] `quotations`

- [ ] **Email Service**
  - [ ] Gmail 2FA enabled
  - [ ] App Password generated
  - [ ] Test email sending

- [ ] **Domain Configuration**
  - [ ] DNS A records configured
  - [ ] Domain propagation verified (use `nslookup` or `dig`)

### 2. Environment Configuration
- [ ] Backend `.env` created with all required variables
- [ ] Frontend `.env.production.local` created
- [ ] Admin `.env.production.local` created
- [ ] All secrets are secure (no defaults in production)
- [ ] JWT_SECRET is 32+ characters
- [ ] Admin password is strong and hashed

### 3. Code Preparation
- [ ] All dependencies installed (`npm install`)
- [ ] Code tested locally
- [ ] Tests passing (`npm test`)
- [ ] No console.logs or debug code
- [ ] Environment variables not hardcoded

---

## Deployment Process

### Option A: VPS Deployment
- [ ] Server provisioned (Ubuntu 20.04+ recommended)
- [ ] SSH access configured
- [ ] Node.js 20.x installed
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Repository cloned to `/var/www/scholarxafrica`
- [ ] Backend dependencies installed
- [ ] Backend `.env` configured
- [ ] Backend started with PM2
- [ ] PM2 startup configured
- [ ] Frontend built (`npm run build:prod`)
- [ ] Admin panel built
- [ ] Nginx configured
- [ ] Nginx tested (`sudo nginx -t`)
- [ ] Nginx restarted
- [ ] SSL certificates installed (Certbot)
- [ ] SSL auto-renewal verified
- [ ] Firewall configured (UFW)
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)

### Option B: Vercel + PaaS
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Backend environment variables configured
- [ ] Backend URL noted
- [ ] Frontend built with correct API_URL
- [ ] Admin built with correct API_URL
- [ ] Vercel CLI installed
- [ ] Deployed to Vercel
- [ ] Custom domain configured on Vercel
- [ ] SSL automatically provisioned

### Option C: Docker Deployment
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] `.env` files configured
- [ ] Frontend and admin built
- [ ] Docker images built
- [ ] Containers started
- [ ] Nginx container configured
- [ ] SSL certificates mounted
- [ ] Container health checks passing

---

## Post-Deployment Tasks

### 1. Initial Data Setup
- [ ] SSH into backend or access shell
- [ ] Run seed scripts:
  - [ ] `npm run seed:services`
  - [ ] `npm run seed:pricing`
  - [ ] `npm run seed:customers` (optional)

### 2. Testing
- [ ] **Backend Health**
  - [ ] `https://api.scholarxafrica.dev/api/health` returns 200
  - [ ] API endpoints accessible
  - [ ] Database connection working

- [ ] **Frontend**
  - [ ] Main site loads: `https://scholarxafrica.dev`
  - [ ] All pages navigate correctly
  - [ ] Forms submit successfully
  - [ ] Images load correctly

- [ ] **Admin Panel**
  - [ ] Admin login accessible: `https://scholarxafrica.dev/admin`
  - [ ] Login works with credentials
  - [ ] Dashboard displays data
  - [ ] All CRUD operations work

- [ ] **Forms & Notifications**
  - [ ] Contact form submits
  - [ ] Quote request form submits
  - [ ] Project request form submits
  - [ ] Email notifications received
  - [ ] File uploads work

### 3. Performance & SEO
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify meta tags and SEO
- [ ] Test mobile responsiveness
- [ ] Check page load times
- [ ] Verify robots.txt accessible
- [ ] Verify sitemap.xml accessible

### 4. Security Verification
- [ ] HTTPS working on all pages
- [ ] SSL certificate valid
- [ ] Security headers present (check with securityheaders.com)
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] Admin routes protected
- [ ] File upload validation working
- [ ] No sensitive data exposed in responses
- [ ] Database credentials secure

### 5. Monitoring Setup
- [ ] **Backend Monitoring**
  - [ ] PM2 monitoring configured
  - [ ] Log rotation configured
  - [ ] Error logging working
  - [ ] Access logs rotating

- [ ] **Application Monitoring** (Optional)
  - [ ] Error tracking (Sentry, etc.)
  - [ ] Analytics (Google Analytics, Plausible)
  - [ ] Uptime monitoring (UptimeRobot, Pingdom)

### 6. Backup Configuration
- [ ] Database backup scheduled
- [ ] File storage backup configured
- [ ] Configuration files backed up
- [ ] Backup restoration tested

---

## Documentation & Handover

### 1. Credentials Documentation (Store Securely)
- [ ] MongoDB connection string
- [ ] Supabase credentials
- [ ] Email credentials
- [ ] Admin login credentials
- [ ] Server SSH credentials
- [ ] Domain registrar access
- [ ] Hosting platform access

### 2. Access Information
- [ ] Main site: https://scholarxafrica.dev
- [ ] Admin panel: https://scholarxafrica.dev/admin
- [ ] API: https://api.scholarxafrica.dev
- [ ] Backend server IP (if applicable)
- [ ] Hosting dashboard URLs

### 3. Important Files
- [ ] `.env` files (backed up securely, not in git)
- [ ] nginx configuration
- [ ] PM2 ecosystem file (if used)
- [ ] SSL certificates location documented

---

## Ongoing Maintenance

### Daily
- [ ] Monitor error logs
- [ ] Check uptime status
- [ ] Review form submissions

### Weekly
- [ ] Review performance metrics
- [ ] Check disk space usage
- [ ] Review security logs
- [ ] Backup verification

### Monthly
- [ ] Update dependencies (security patches)
- [ ] Review and optimize database
- [ ] Check SSL certificate expiry
- [ ] Review and update content

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Backup restoration test
- [ ] Review and update documentation

---

## Emergency Contacts & Resources

### Quick Access
- [ ] Backend logs: `pm2 logs scholarxafrica-backend`
- [ ] Nginx logs: `/var/log/nginx/error.log`
- [ ] Restart backend: `pm2 restart scholarxafrica-backend`
- [ ] Restart nginx: `sudo systemctl restart nginx`

### Support Resources
- MongoDB Atlas: https://cloud.mongodb.com
- Supabase: https://supabase.com
- Vercel: https://vercel.com
- Let's Encrypt: https://letsencrypt.org

### Documentation
- Deployment Guide: `DEPLOYMENT-GUIDE.md`
- Quick Deploy: `QUICK-DEPLOY.md`
- Environment Templates: `.env.production` files

---

## Rollback Plan

### If Deployment Fails
1. **Backend Issues**
   ```bash
   # Rollback to previous version
   pm2 stop scholarxafrica-backend
   git checkout previous-working-commit
   cd backend && npm install
   pm2 restart scholarxafrica-backend
   ```

2. **Frontend Issues**
   - Revert to previous Vercel deployment (in dashboard)
   - Or rebuild from previous commit:
     ```bash
     git checkout previous-working-commit
     npm install && npm run build:prod
     ```

3. **Database Issues**
   - Restore from latest backup
   - Verify data integrity
   - Test application functionality

---

## Success Criteria

Deployment is successful when:
- [ ] All pages load without errors
- [ ] Admin can login and manage content
- [ ] Forms submit and send emails
- [ ] File uploads work correctly
- [ ] Site is secure (HTTPS)
- [ ] Performance is acceptable (Lighthouse > 90)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SEO properly configured
- [ ] Monitoring is active

---

**Date Deployed**: _______________
**Deployed By**: _______________
**Version**: _______________
**Notes**: _______________
