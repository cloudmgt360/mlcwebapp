# Deployment Guide - DigitalOcean App Platform

This guide will help you deploy the Loan & Mortgage Calculator to DigitalOcean App Platform.

## Prerequisites

1. **DigitalOcean Account**: Sign up at https://cloud.digitalocean.com/registrations/new
2. **GitHub Repository**: Push your code to a GitHub repository
3. **GitHub Permissions**: You need Owner or Maintainer access to the repository

## Pre-Deployment Checklist

### 1. Update App Configuration

Edit `.do/app.yaml` and update the GitHub repository information:

```yaml
github:
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
  branch: main
```

Replace:
- `YOUR_GITHUB_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

### 2. Environment Variables

The application automatically uses these environment variables:
- `PORT` - HTTP port (automatically set by DigitalOcean)
- `NODE_ENV` - Set to `production` for deployments

**No database required** - This calculator runs entirely client-side with no data persistence.

### 3. Verify Build Process

Make sure your build works locally:

```bash
npm ci
npm run build
npm start
```

## Deployment Steps

### Option 1: Using the App Specification File (Recommended)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for DigitalOcean deployment"
   git push origin main
   ```

2. **Go to DigitalOcean App Platform**:
   - Visit https://cloud.digitalocean.com/apps
   - Click "Create App"

3. **Connect GitHub**:
   - Select "GitHub" as source
   - Authorize DigitalOcean to access your repositories
   - Select your repository
   - Select the `main` branch

4. **Import App Spec**:
   - DigitalOcean will detect the `.do/app.yaml` file
   - Review the configuration
   - Make any necessary adjustments

5. **Configure Resources**:
   - Instance size: **Basic ($5/month)** is sufficient
   - Region: Choose closest to your users (default: NYC)

6. **Review and Deploy**:
   - Review all settings
   - Click "Create Resources"
   - Wait for the build and deployment (usually 3-5 minutes)

### Option 2: Manual Configuration

If you prefer to configure manually without `app.yaml`:

1. **Create App** and connect GitHub repository

2. **Configure Build Settings**:
   - Build Command: `npm ci && npm run build`
   - Run Command: `npm start`

3. **Environment Variables**:
   - Add `NODE_ENV` = `production`
   - PORT is automatically set by DigitalOcean

4. **HTTP Configuration**:
   - HTTP Port: 8080 (or use default)
   - Routes: `/` (catch-all)

5. **Health Check**:
   - HTTP Path: `/`
   - Initial Delay: 10 seconds
   - Period: 10 seconds

## Post-Deployment

### Accessing Your App

After successful deployment, you'll receive:
- **Live URL**: `https://your-app-name.ondigitalocean.app`
- You can add a custom domain later

### Monitoring

- **Build Logs**: View in the DigitalOcean console under "Deployments"
- **Runtime Logs**: Check "Runtime Logs" tab for server output
- **Metrics**: View CPU, memory, and bandwidth usage

### Continuous Deployment

Your app will automatically redeploy when you push to the `main` branch:

```bash
git add .
git commit -m "Update calculator features"
git push origin main
```

DigitalOcean will:
1. Detect the push
2. Run the build process
3. Deploy with zero downtime
4. Rollback automatically if deployment fails

## Troubleshooting

### Build Fails

**Problem**: "Module not found" or dependency errors

**Solution**:
1. Check that all required packages are in `package.json`
2. Verify `npm ci && npm run build` works locally
3. Check build logs in DigitalOcean console

### Application Won't Start

**Problem**: App builds but doesn't serve requests

**Solution**:
1. Verify the server uses `process.env.PORT`
2. Check that static files are built to `dist/public`
3. Review runtime logs for errors

### Static Files Not Loading

**Problem**: 404 errors for CSS/JS files

**Solution**:
1. Ensure `npm run build` completes successfully
2. Verify `dist/public` directory is created
3. Check that `serveStatic` function serves from correct path

## Scaling

### Vertical Scaling (Upgrade Instance)

- **Basic ($5/mo)**: Good for low traffic (< 1000 daily users)
- **Professional ($12/mo)**: Medium traffic (< 10,000 daily users)
- **Professional Plus ($24/mo)**: High traffic (< 50,000 daily users)

### Horizontal Scaling (Add Instances)

Increase `instance_count` in `app.yaml`:

```yaml
instance_count: 2  # Run 2 instances for redundancy
```

## Cost Estimates

- **Basic Plan**: $5/month
  - 512 MB RAM
  - 1 vCPU
  - Good for most personal projects

- **Bandwidth**: 40 GB included, then $0.01/GB

**Estimated monthly cost for typical usage**: $5-7/month

## Custom Domain

To add a custom domain (e.g., `calculator.yourdomain.com`):

1. Go to your app in DigitalOcean console
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records at your domain registrar:
   - Add CNAME record pointing to DigitalOcean app URL

## Rollback

If a deployment has issues:

1. Go to "Deployments" tab
2. Find the last working deployment
3. Click "Rollback to this deployment"

## Security Notes

- ✅ HTTPS is enabled by default
- ✅ No sensitive data stored (calculator is client-side only)
- ✅ No database credentials needed
- ✅ PORT environment variable properly configured

## Support

- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Community**: https://www.digitalocean.com/community/
- **Tutorials**: https://www.digitalocean.com/community/tutorials

## Quick Reference

```bash
# Test build locally
npm ci && npm run build && npm start

# Push to deploy
git push origin main

# Check logs
# Visit: https://cloud.digitalocean.com/apps → Select App → Runtime Logs
```

## Application Architecture

```
┌─────────────────────────────────────┐
│   DigitalOcean App Platform         │
├─────────────────────────────────────┤
│  Node.js Server (Express)           │
│  ├─ Serves static files from dist/  │
│  ├─ API routes (if needed)          │
│  └─ Listens on process.env.PORT    │
│                                      │
│  Built Assets (dist/public/)        │
│  ├─ index.html                      │
│  ├─ JavaScript bundles              │
│  ├─ CSS stylesheets                 │
│  └─ Assets                          │
└─────────────────────────────────────┘
```

All loan calculations happen client-side in the browser - no backend processing required!
