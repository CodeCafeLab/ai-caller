# GitHub Secrets Setup Guide

## 🔐 Required Secrets for CI/CD Pipeline

To use the GitHub Actions workflows, you need to set up the following secrets in your repository:

### **1. Go to Repository Settings**
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**

### **2. Add the Following Secrets**

#### **JWT_SECRET** (Required)
- **Description**: Secret key for JWT token generation
- **Value**: A strong, random string (at least 32 characters)
- **Example**: `your-super-secret-jwt-key-here-12345`

#### **SNYK_TOKEN** (Optional - for security scanning)
- **Description**: Snyk API token for security vulnerability scanning
- **Value**: Get from [Snyk Dashboard](https://app.snyk.io/account)
- **Note**: If not provided, security scanning will be skipped

### **3. How to Generate JWT_SECRET**

#### **Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### **Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

#### **Option C: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated string

### **4. Secret Names Must Match Exactly**
- `JWT_SECRET` (not `jwt_secret` or `JWT_SECRET_KEY`)
- `SNYK_TOKEN` (not `snyk_token` or `SNYK_API_TOKEN`)

### **5. After Adding Secrets**
1. Secrets are automatically encrypted
2. They will be available in your workflows
3. You can update them anytime
4. **Never commit secrets to your code!**

## 🚀 Workflow Usage

### **Automatic Triggers**
- **Push to main/develop**: Full CI/CD pipeline runs
- **Pull Request**: Code quality and build checks run

### **Manual Deployment**
1. Go to **Actions** tab
2. Select **AI Caller CI/CD Pipeline**
3. Click **Run workflow**
4. Choose environment (staging/production)
5. Click **Run workflow**

### **Workflow Status**
- ✅ **Green**: All checks passed
- ❌ **Red**: Some checks failed
- 🟡 **Yellow**: Workflow is running

## 🔍 Troubleshooting

### **Common Issues**

#### **"Secret not found" Error**
- Check if secret name matches exactly
- Ensure secret is added to the correct repository
- Wait a few minutes after adding the secret

#### **Workflow Fails on JWT_SECRET**
- Verify JWT_SECRET is set
- Check if the secret value is not empty
- Ensure the secret name is exactly `JWT_SECRET`

#### **Permission Denied**
- Check if you have admin access to the repository
- Verify GitHub Actions are enabled in repository settings

### **Need Help?**
- Check the workflow logs in the Actions tab
- Review the error messages for specific issues
- Ensure all required dependencies are installed
