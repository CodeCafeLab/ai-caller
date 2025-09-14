#!/bin/bash

# AI Caller Server Deployment Script
# This script deploys the application from GitHub Actions artifacts

set -e  # Exit on any error

# Configuration
APP_NAME="ai-caller"
APP_DIR="/var/www/ai-caller"
BACKUP_DIR="/var/www/backups"
DEPLOYMENT_FILE="ai-caller-deployment.tar.gz"
LOG_FILE="/var/log/ai-caller-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as a regular user with sudo privileges."
fi

# Check if required directories exist
if [ ! -d "$APP_DIR" ]; then
    error "Application directory $APP_DIR does not exist. Please create it first."
fi

if [ ! -d "$BACKUP_DIR" ]; then
    log "Creating backup directory $BACKUP_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo chown $USER:$USER "$BACKUP_DIR"
fi

# Function to create backup
create_backup() {
    log "Creating backup of current application..."
    
    if [ -d "$APP_DIR/.next" ] || [ -f "$APP_DIR/server.js" ]; then
        BACKUP_NAME="ai-caller-backup-$(date +'%Y%m%d-%H%M%S').tar.gz"
        BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
        
        cd "$APP_DIR"
        tar -czf "$BACKUP_PATH" \
            --exclude=node_modules \
            --exclude=.git \
            --exclude=uploads \
            --exclude=logs \
            . || warning "Backup creation failed, continuing anyway..."
        
        if [ -f "$BACKUP_PATH" ]; then
            success "Backup created: $BACKUP_PATH"
        fi
    else
        warning "No existing application found to backup"
    fi
}

# Function to stop application
stop_application() {
    log "Stopping application..."
    
    # Try to stop with PM2
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "$APP_NAME"; then
            pm2 stop "$APP_NAME" || warning "Failed to stop PM2 process"
        fi
    fi
    
    # Try to stop with systemctl
    if sudo systemctl is-active --quiet ai-caller; then
        sudo systemctl stop ai-caller || warning "Failed to stop systemctl service"
    fi
    
    # Kill any remaining Node.js processes
    pkill -f "node.*server.js" || true
    sleep 2
}

# Function to start application
start_application() {
    log "Starting application..."
    
    cd "$APP_DIR"
    
    # Install dependencies
    log "Installing dependencies..."
    npm ci --production || error "Failed to install dependencies"
    
    # Try to start with PM2
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "$APP_NAME"; then
            pm2 restart "$APP_NAME" || error "Failed to restart PM2 process"
        else
            pm2 start server.js --name "$APP_NAME" || error "Failed to start PM2 process"
        fi
        pm2 save
        success "Application started with PM2"
    else
        # Fallback to systemctl
        if [ -f "/etc/systemd/system/ai-caller.service" ]; then
            sudo systemctl daemon-reload
            sudo systemctl start ai-caller || error "Failed to start systemctl service"
            success "Application started with systemctl"
        else
            # Start directly
            nohup node server.js > app.log 2>&1 &
            echo $! > app.pid
            success "Application started directly (PID: $(cat app.pid))"
        fi
    fi
}

# Function to check application health
check_health() {
    log "Checking application health..."
    
    # Wait for application to start
    sleep 5
    
    # Check if application is responding
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        success "Application is healthy and responding"
        return 0
    else
        error "Application is not responding to health check"
        return 1
    fi
}

# Function to rollback
rollback() {
    warning "Rolling back to previous version..."
    
    # Find the most recent backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/ai-caller-backup-*.tar.gz 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restoring from backup: $LATEST_BACKUP"
        
        # Stop application
        stop_application
        
        # Restore from backup
        cd "$APP_DIR"
        tar -xzf "$LATEST_BACKUP" || error "Failed to restore from backup"
        
        # Start application
        start_application
        
        # Check health
        if check_health; then
            success "Rollback completed successfully"
        else
            error "Rollback failed - application is not healthy"
        fi
    else
        error "No backup found for rollback"
    fi
}

# Main deployment function
deploy() {
    log "Starting deployment of $APP_NAME..."
    
    # Check if deployment file exists
    if [ ! -f "$DEPLOYMENT_FILE" ]; then
        error "Deployment file $DEPLOYMENT_FILE not found. Please download it from GitHub Actions artifacts first."
    fi
    
    # Create backup
    create_backup
    
    # Stop application
    stop_application
    
    # Extract deployment package
    log "Extracting deployment package..."
    cd "$APP_DIR"
    tar -xzf "../$DEPLOYMENT_FILE" || error "Failed to extract deployment package"
    
    # Set proper permissions
    log "Setting permissions..."
    sudo chown -R $USER:$USER "$APP_DIR"
    chmod +x server.js
    
    # Start application
    start_application
    
    # Check health
    if check_health; then
        success "Deployment completed successfully!"
        
        # Clean up old backups (keep last 5)
        log "Cleaning up old backups..."
        cd "$BACKUP_DIR"
        ls -t ai-caller-backup-*.tar.gz | tail -n +6 | xargs -r rm
        
        # Remove deployment file
        rm -f "../$DEPLOYMENT_FILE"
        
        log "Deployment log saved to: $LOG_FILE"
    else
        error "Deployment failed - application is not healthy"
        rollback
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  deploy     Deploy the application"
    echo "  rollback   Rollback to previous version"
    echo "  status     Check application status"
    echo "  backup     Create backup only"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy      # Deploy the application"
    echo "  $0 rollback    # Rollback to previous version"
    echo "  $0 status      # Check if application is running"
}

# Check application status
check_status() {
    log "Checking application status..."
    
    # Check PM2
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "$APP_NAME"; then
            pm2 show "$APP_NAME"
        else
            warning "No PM2 process found for $APP_NAME"
        fi
    fi
    
    # Check systemctl
    if sudo systemctl is-active --quiet ai-caller; then
        success "Application is running via systemctl"
        sudo systemctl status ai-caller --no-pager -l
    else
        warning "Application is not running via systemctl"
    fi
    
    # Check direct process
    if [ -f "$APP_DIR/app.pid" ]; then
        PID=$(cat "$APP_DIR/app.pid")
        if ps -p $PID > /dev/null; then
            success "Application is running directly (PID: $PID)"
        else
            warning "Application PID file exists but process is not running"
        fi
    fi
    
    # Check if port is listening
    if netstat -tlnp 2>/dev/null | grep -q ":5000"; then
        success "Port 5000 is listening"
    else
        warning "Port 5000 is not listening"
    fi
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    status)
        check_status
        ;;
    backup)
        create_backup
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        error "Unknown option: $1"
        usage
        exit 1
        ;;
esac
