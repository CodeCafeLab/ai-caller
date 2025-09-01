# Deployment Setup Guide

## 🚨 Current Issues

### 1. DNS Configuration
- **Problem**: `sandbox.aidial.in` shows `DNS_PROBE_FINISHED_NXDOMAIN`
- **Solution**: Configure DNS records for subdomains

### 2. Workflow Deployment Package Failure
- **Problem**: "Create deployment package" step failing
- **Solution**: Enhanced error handling and verification

## 🔧 DNS Setup

### For Production (`aidial.in`)
```
Type: A
Name: @
Value: [Your Server IP]
```

### For Sandbox (`sandbox.aidial.in`)
```
Type: A
Name: sandbox
Value: [Your Server IP]
```

### For Staging (`staging.aidial.in`)
```
Type: A
Name: staging
Value: [Your Server IP]
```

## 🚀 Deployment Process

### Step 1: Configure DNS
1. Go to your domain registrar (where you bought `aidial.in`)
2. Find DNS management
3. Add the A records above pointing to your server IP

### Step 2: Server Setup
1. **Install Node.js** (v18+)
2. **Install PM2**: `npm install -g pm2`
3. **Create deployment directory**:
   ```bash
   mkdir -p /var/www/ai-caller
   cd /var/www/ai-caller
   ```

### Step 3: Manual Deployment (Temporary)
Until the workflow is fixed, deploy manually:

```bash
# On your server
cd /var/www/ai-caller

# Download the latest code
git clone https://github.com/avyuktaecall/avyukta_ai_caller.git .
git checkout sandbox1  # or main for production

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your settings

# Build the application
npm run build

# Start with PM2
pm2 start server.js --name "ai-caller"
pm2 save
pm2 startup
```

### Step 4: Nginx Configuration
Create `/etc/nginx/sites-available/ai-caller`:

```nginx
server {
    listen 80;
    server_name aidial.in www.aidial.in;
    
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
    }
}

server {
    listen 80;
    server_name sandbox.aidial.in;
    
    location / {
        proxy_pass http://localhost:5001;  # Different port for sandbox
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ai-caller /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 Troubleshooting

### Check if services are running:
```bash
pm2 status
pm2 logs ai-caller
sudo systemctl status nginx
```

### Check DNS propagation:
```bash
nslookup sandbox.aidial.in
dig sandbox.aidial.in
```

### Check server connectivity:
```bash
curl -I http://localhost:5000
curl -I http://localhost:5001
```

## 📋 Next Steps

1. **Fix DNS records** for subdomains
2. **Deploy manually** to test
3. **Fix GitHub Actions workflow** (enhanced error handling added)
4. **Set up automatic deployment** once workflow is stable

## 🆘 Need Help?

- **DNS Issues**: Contact your domain registrar
- **Server Issues**: Check server logs and connectivity
- **Workflow Issues**: Check GitHub Actions logs for specific errors
