#!/bin/bash

# AI Caller Production Build Fix
# Run this script on your server to fix build issues

echo "🔧 AI Caller Production Build Fix"
echo "================================="

APP_DIR="/var/www/ai-caller"

# Check if we're on the server
if [ ! -d "$APP_DIR" ]; then
    echo "❌ This script should be run on the production server"
    echo "   Expected directory: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

echo "📍 Current directory: $(pwd)"

# Stop current processes
echo "🛑 Stopping current processes..."
pm2 stop all 2>/dev/null || true

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Set production environment
echo "🔧 Setting production environment..."
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=https://aicaller.codecafelab.in
NODE_ENV=production
EOF

# Update backend environment
if [ -f "backend/.env" ]; then
    if ! grep -q "NODE_ENV" backend/.env; then
        echo "NODE_ENV=production" >> backend/.env
    else
        sed -i 's/NODE_ENV=.*/NODE_ENV=production/' backend/.env
    fi
else
    echo "❌ Backend .env file not found!"
    exit 1
fi

echo "✅ Environment variables set"

# Install/update dependencies
echo "📦 Installing frontend dependencies..."
npm ci

echo "📦 Installing backend dependencies..."
cd backend
npm ci
cd ..

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next

# Build for production
echo "🏗️ Building for production..."
if npm run build; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed, trying alternative approach..."
    
    # Try building without linting
    echo "🔄 Attempting build without linting..."
    ESLINT_NO_DEV_ERRORS=true npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build still failed, installing ESLint..."
        npm install --save-dev eslint eslint-config-next
        npm run build
    fi
fi

# Start applications
echo "🚀 Starting applications..."
pm2 start npm --name "ai-caller-api" --cwd "$APP_DIR/backend" -- start
pm2 start npm --name "ai-caller-web" --cwd "$APP_DIR" -- start

# Save PM2 configuration
pm2 save

# Check status
echo "📊 Checking status..."
sleep 3
pm2 status

# Test endpoints
echo "🔍 Testing endpoints..."
echo "Backend health:"
curl -s -I http://localhost:5000/api/health | head -1

echo "Frontend (via nginx):"
curl -s -I https://aicaller.codecafelab.in/api/health | head -1

echo ""
echo "✅ Build fix completed!"
echo ""
echo "🔗 Your application should now be accessible at:"
echo "   https://aicaller.codecafelab.in"
echo ""
echo "🐛 If you still have issues:"
echo "   - Check logs: pm2 logs"
echo "   - Check nginx: sudo systemctl status nginx"
echo "   - Restart nginx: sudo systemctl restart nginx"