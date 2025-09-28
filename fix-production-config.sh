#!/bin/bash

# AI Caller Production Configuration Fix
# Run this script on your server after deployment

echo "🔧 Fixing production configuration..."

# Set production environment variables
echo "Setting production environment variables..."

# Update frontend environment
cat > /var/www/ai-caller/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=https://aicaller.codecafelab.in
NODE_ENV=production
EOF

echo "✅ Updated frontend environment (.env.local)"

# Update backend environment (preserve existing values)
if [ -f "/var/www/ai-caller/backend/.env" ]; then
    # Update NODE_ENV in existing file
    sed -i 's/NODE_ENV=.*/NODE_ENV=production/' /var/www/ai-caller/backend/.env
    
    # Add NODE_ENV if it doesn't exist
    if ! grep -q "NODE_ENV" /var/www/ai-caller/backend/.env; then
        echo "NODE_ENV=production" >> /var/www/ai-caller/backend/.env
    fi
    
    echo "✅ Updated backend environment (NODE_ENV=production)"
else
    echo "❌ Backend .env file not found!"
    exit 1
fi

# Navigate to project directory
cd /var/www/ai-caller

# Stop current processes
echo "🛑 Stopping current processes..."
pm2 delete ai-caller-web 2>/dev/null || true
pm2 delete ai-caller-api 2>/dev/null || true

# Clean and rebuild frontend
echo "🏗️ Rebuilding frontend for production..."
rm -rf .next
npm run build

# Restart applications
echo "🚀 Starting applications..."
pm2 start npm --name "ai-caller-api" --cwd "/var/www/ai-caller/backend" -- start
pm2 start npm --name "ai-caller-web" --cwd "/var/www/ai-caller" -- start

# Save PM2 configuration
pm2 save

# Check status
echo "📊 Checking application status..."
sleep 5
pm2 status

echo ""
echo "✅ Configuration fix completed!"
echo ""
echo "🔗 Your application should now be accessible at:"
echo "   https://aicaller.codecafelab.in"
echo ""
echo "🐛 If you still have issues:"
echo "   - Check logs: pm2 logs"
echo "   - Verify environment: cat .env.local"
echo "   - Test API: curl https://aicaller.codecafelab.in/api/health"