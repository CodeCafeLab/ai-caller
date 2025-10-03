# AI Caller - Deployment Guide

## Overview
This document outlines the CI/CD workflow and deployment process for the AI Caller application.

## Workflow Structure

### 1. Build and Test Job (`build-and-test`)
- **Triggers**: Pull requests to main, pushes to main
- **Purpose**: Validates code quality before deployment
- **Steps**:
  - Checkout code with full history
  - Setup Node.js 18 with npm caching
  - Install and validate frontend dependencies
  - Run linting and TypeScript checks
  - Build frontend application
  - Install and validate backend dependencies
  - Validate backend configuration

### 2. Security Audit Job (`security-audit`)
- **Triggers**: Pull requests to main, pushes to main
- **Purpose**: Checks for security vulnerabilities
- **Steps**:
  - Run npm audit on frontend dependencies
  - Run npm audit on backend dependencies
  - Uses `continue-on-error: true` to avoid blocking deployments for low-severity issues

### 3. Deploy Job (`deploy`)
- **Triggers**: Only pushes to main branch (after successful build and audit)
- **Requirements**: `build-and-test` and `security-audit` jobs must pass
- **Environment**: Production environment with manual approval gates
- **Steps**:
  - Validate required environment variables
  - Deploy backend with health checks and rollback capability
  - Deploy frontend with health checks and rollback capability
  - Send deployment notifications

## Environment Setup

### Required Secrets
Add these secrets to your GitHub repository settings:

1. `SERVER_PASSWORD`: SSH password for deployment server

### Server Requirements
- **Server IP**: 168.231.112.124
- **SSH Access**: Root user with password authentication
- **PM2**: Process manager for Node.js applications
- **Node.js**: Version 18 or higher
- **Git**: For pulling latest code

### Directory Structure
```
/var/www/ai-caller/
├── backend/          # Backend application
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── package.json      # Frontend dependencies
├── .next/           # Next.js build output
└── node_modules/    # Dependencies
```

### PM2 Process Names
- Backend: `ai-caller-backend`
- Frontend: `ai-caller-frontend`

## Deployment Features

### 🚀 Automated Backup System
- Creates timestamped backups before each deployment
- Backend: Full directory backup
- Frontend: .next build folder backup
- Automatic cleanup (keeps last 3 backups)

### 🏥 Health Checks
- **Pre-deployment**: Checks if processes exist
- **Post-deployment**: Verifies processes are online
- **Failure handling**: Shows logs and exits with error code

### 🔄 Rollback Capability
- Automatic rollback on build failure
- Manual rollback using backup directories
- PM2 process restart on failure

### 📊 Comprehensive Logging
- Step-by-step deployment progress
- Clear success/failure indicators
- Detailed error messages with context
- PM2 logs on failure

### ⚡ Performance Optimizations
- `npm ci` instead of `npm install` for faster, reliable installs
- Silent installations to reduce log noise
- Parallel job execution for build and security audit
- Caching of Node.js and npm dependencies

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build locally
   npm run build
   npm run typecheck
   npm run lint
   ```

2. **Deployment Hangs**
   - Check server connectivity: `ssh root@168.231.112.124`
   - Verify PM2 status: `pm2 status`
   - Check server resources: `htop` or `free -m`

3. **Process Restart Issues**
   ```bash
   # On server, restart processes manually
   pm2 restart ai-caller-backend
   pm2 restart ai-caller-frontend
   pm2 save  # Save PM2 configuration
   ```

4. **Environment Variable Issues**
   - Verify secrets are set in GitHub repository settings
   - Check secret names match exactly in workflow file

### Manual Deployment Commands

If needed, deploy manually on the server:

```bash
# Backend deployment
cd /var/www/ai-caller/backend
git pull origin main
npm ci --production
pm2 restart ai-caller-backend

# Frontend deployment
cd /var/www/ai-caller
git pull origin main
npm ci
npm run build
pm2 restart ai-caller-frontend
```

### Rollback Commands

To rollback to a previous version:

```bash
# Find backup directories
ls -la /var/www/ai-caller/ | grep backup

# Rollback backend
cd /var/www/ai-caller
cp -r backend-backup-YYYYMMDD_HHMMSS/* backend/
cd backend
pm2 restart ai-caller-backend

# Rollback frontend
cd /var/www/ai-caller
rm -rf .next
mv .next-backup-YYYYMMDD_HHMMSS .next
pm2 restart ai-caller-frontend
```

## Monitoring

### Check Deployment Status
- View workflow runs in GitHub Actions
- Monitor server processes: `pm2 monit`
- Check application logs: `pm2 logs`

### Performance Monitoring
```bash
# Check server resources
htop
df -h
free -m

# Check PM2 processes
pm2 status
pm2 show ai-caller-backend
pm2 show ai-caller-frontend
```

## Security Considerations

1. **Dependency Auditing**: Regular security audits on all dependencies
2. **Server Access**: SSH access restricted to deployment purposes
3. **Environment Variables**: All sensitive data stored as GitHub secrets
4. **Production Environment**: Manual approval gates for production deployments

## Best Practices

1. **Testing**: Always test changes locally before pushing
2. **Small Deployments**: Deploy small, incremental changes
3. **Monitoring**: Monitor application performance after deployments
4. **Rollback Plan**: Always have a rollback plan ready
5. **Documentation**: Keep deployment documentation up to date

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Check server logs via PM2
3. Verify server connectivity and resources
4. Review this documentation for troubleshooting steps