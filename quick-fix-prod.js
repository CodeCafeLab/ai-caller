#!/usr/bin/env node

/**
 * Quick Production Fix for AI Caller
 * This script can be run directly on the server to fix API URL issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 AI Caller Quick Production Fix');
console.log('================================');

// Configuration
const domain = 'aicaller.codecafelab.in';
const appDir = '/var/www/ai-caller';

// Check if we're running on the server
const isOnServer = fs.existsSync(appDir);

if (!isOnServer) {
  console.log('❌ This script should be run on the production server');
  console.log(`   Expected directory: ${appDir}`);
  process.exit(1);
}

try {
  // 1. Update frontend environment
  const frontendEnvPath = path.join(appDir, '.env.local');
  const frontendEnv = `NEXT_PUBLIC_API_BASE_URL=https://${domain}
NODE_ENV=production
`;

  fs.writeFileSync(frontendEnvPath, frontendEnv, 'utf8');
  console.log('✅ Updated frontend environment (.env.local)');

  // 2. Update backend environment
  const backendEnvPath = path.join(appDir, 'backend', '.env');
  
  if (fs.existsSync(backendEnvPath)) {
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    
    // Update or add NODE_ENV
    if (backendEnv.includes('NODE_ENV=')) {
      backendEnv = backendEnv.replace(/NODE_ENV=.*/g, 'NODE_ENV=production');
    } else {
      backendEnv += '\nNODE_ENV=production\n';
    }
    
    fs.writeFileSync(backendEnvPath, backendEnv, 'utf8');
    console.log('✅ Updated backend environment (.env)');
  } else {
    console.log('⚠️  Backend .env file not found, creating minimal one...');
    const minimalBackendEnv = `NODE_ENV=production
PORT=5000
JWT_SECRET=change-this-in-production
DB_HOST=localhost
DB_USER=aicaller
DB_PASSWORD=SecurePassword123!
DB_NAME=ai-caller
`;
    fs.writeFileSync(backendEnvPath, minimalBackendEnv, 'utf8');
    console.log('✅ Created backend environment file');
  }

  // 3. Create a runtime configuration override (for immediate effect)
  const runtimeConfigPath = path.join(appDir, 'next.config.runtime.js');
  const runtimeConfig = `// Runtime configuration override
module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://${domain}',
    NODE_ENV: 'production'
  },
  publicRuntimeConfig: {
    apiBaseUrl: 'https://${domain}'
  }
};
`;

  fs.writeFileSync(runtimeConfigPath, runtimeConfig, 'utf8');
  console.log('✅ Created runtime configuration override');

  console.log('\n🚀 Next Steps:');
  console.log('1. Restart the applications:');
  console.log('   pm2 restart all');
  console.log('');
  console.log('2. If issues persist, rebuild the frontend:');
  console.log('   cd /var/www/ai-caller');
  console.log('   rm -rf .next');
  console.log('   npm run build');
  console.log('   pm2 restart all');
  console.log('');
  console.log(`3. Test the application: https://${domain}`);

} catch (error) {
  console.error('❌ Error applying fixes:', error.message);
  process.exit(1);
}

console.log('\n✅ Quick fix completed!');