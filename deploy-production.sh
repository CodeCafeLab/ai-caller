#!/bin/bash

# AI Caller Production Deployment Script
# Run this script on your server to deploy the application

set -e  # Exit on any error

echo "🚀 Starting AI Caller Production Deployment..."

# Configuration
APP_DIR="/var/www/ai-caller"
DOMAIN="aicaller.codecafelab.in"
NODE_VERSION="20"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Function to print colored output
print_status() {
    echo -e "\e[1;34m[INFO]\e[0m $1"
}

print_success() {
    echo -e "\e[1;32m[SUCCESS]\e[0m $1"
}

print_error() {
    echo -e "\e[1;31m[ERROR]\e[0m $1"
}

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install prerequisites
print_status "Installing prerequisites..."
sudo apt install -y nginx git curl build-essential software-properties-common mysql-server ufw

# Install Node.js
print_status "Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node_version=$(node --version)
npm_version=$(npm --version)
print_success "Node.js $node_version and npm $npm_version installed"

# Install PM2
print_status "Installing PM2..."
sudo npm install -g pm2

# Setup PM2 startup
pm2 startup systemd -u $USER --hp $HOME > /tmp/pm2_startup.sh
sudo bash /tmp/pm2_startup.sh

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone repository
print_status "Cloning repository..."
cd $APP_DIR
if [ -d ".git" ]; then
    print_status "Repository exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/CodeCafeLab/ai-caller.git .
fi

# Setup MySQL database
print_status "Setting up MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS \`ai-caller\`;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'aicaller'@'localhost' IDENTIFIED BY 'SecurePassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON \`ai-caller\`.* TO 'aicaller'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Create environment files
print_status "Creating environment configuration..."

# Frontend environment
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=https://$DOMAIN
NODE_ENV=production
EOF

# Backend environment
cat > backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=aicaller
DB_PASSWORD=SecurePassword123!
DB_NAME=ai-caller

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)

# Server Configuration
PORT=5000
NODE_ENV=production

# ElevenLabs Configuration (UPDATE WITH YOUR ACTUAL API KEY)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# Email Configuration (UPDATE WITH YOUR ACTUAL SMTP SETTINGS)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Cookie Configuration
COOKIE_SECRET=$(openssl rand -base64 32)
EOF

print_status "⚠️  IMPORTANT: Update the following in backend/.env:"
print_status "   - ELEVENLABS_API_KEY"
print_status "   - SMTP_* settings for email functionality"

# Install dependencies and build
print_status "Installing frontend dependencies..."
npm ci

print_status "Building frontend..."
npm run build

print_status "Installing backend dependencies..."
cd backend
npm ci
cd ..

# Start applications with PM2
print_status "Starting applications with PM2..."

# Stop existing processes if they exist
pm2 delete ai-caller-api 2>/dev/null || true
pm2 delete ai-caller-web 2>/dev/null || true

# Start backend
pm2 start npm --name "ai-caller-api" --cwd "$APP_DIR/backend" -- start

# Start frontend
pm2 start npm --name "ai-caller-web" --cwd "$APP_DIR" -- start

# Save PM2 configuration
pm2 save

# Configure nginx
print_status "Configuring nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN << 'NGINX_EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Increase upload size
    client_max_body_size 50m;
    client_body_timeout 120s;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Main application (Next.js frontend)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # Buffer settings
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # API routes (Express.js backend)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # Buffer settings
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Static uploads
    location /uploads/ {
        alias /var/www/ai-caller/uploads/;
        autoindex off;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Security for uploads
        location ~* \.(php|jsp|cgi|asp|sh)$ {
            deny all;
        }
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ ^/(\.env|\.git|node_modules|package\.json|package-lock\.json)/ {
        deny all;
    }
}
NGINX_EOF

# Replace domain placeholder
sudo sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
print_status "Testing nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
    sudo systemctl enable nginx
    sudo systemctl restart nginx
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Setup firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Install SSL certificate
print_status "Installing SSL certificate..."
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Test auto-renewal
sudo certbot renew --dry-run

# Create deployment script for future updates
print_status "Creating deployment script for future updates..."
cat > $APP_DIR/deploy-update.sh << 'UPDATE_EOF'
#!/bin/bash
set -e

echo "🔄 Updating AI Caller application..."

cd /var/www/ai-caller

# Pull latest changes
git pull origin main

# Install dependencies
npm ci
cd backend
npm ci
cd ..

# Build frontend
npm run build

# Restart applications
pm2 restart ai-caller-web
pm2 restart ai-caller-api

# Save PM2 configuration
pm2 save

echo "✅ Application updated successfully!"
UPDATE_EOF

chmod +x $APP_DIR/deploy-update.sh

# Final status check
print_status "Performing final status checks..."

# Check PM2 processes
pm2_status=$(pm2 status | grep -c "online" || echo "0")
if [ "$pm2_status" -ge "2" ]; then
    print_success "PM2 processes are running ($pm2_status online)"
else
    print_error "PM2 processes are not running properly"
fi

# Check nginx status
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check database connection
if mysql -u aicaller -pSecurePassword123! -e "USE \`ai-caller\`; SELECT 1;" >/dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
fi

print_success "🎉 Deployment completed successfully!"
echo
echo "📋 Next Steps:"
echo "1. Update backend/.env with your actual API keys and SMTP settings"
echo "2. Test the application at: https://$DOMAIN"
echo "3. Use ./deploy-update.sh for future updates"
echo
echo "🔧 Useful Commands:"
echo "  - Check app status: pm2 status"
echo "  - View logs: pm2 logs"
echo "  - Check nginx: sudo systemctl status nginx"
echo "  - Update app: ./deploy-update.sh"
echo
print_status "Application should be accessible at: https://$DOMAIN"