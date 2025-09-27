# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI Caller is a Next.js application with a separate Express.js backend that provides AI-powered voice calling services. The application uses ElevenLabs for voice generation, MySQL for data persistence, and Firebase for additional services.

## Essential Commands

### Development Setup
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Setup environment (interactive menu)
npm run setup:menu

# Setup for localhost development
npm run setup:localhost

# Setup with ngrok tunneling
npm run setup:ngrok
```

### Development Workflow
```bash
# Start frontend dev server (with Turbopack)
npm run dev

# Start backend server (from backend directory)
cd backend && npm run dev

# Start backend in production mode
cd backend && npm start

# Alternative: Use Windows batch file for backend
cd backend && start.bat
```

### Build and Production
```bash
# Build frontend for production
npm run build

# Start production frontend server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

### AI/Genkit Development
```bash
# Start Genkit development server
npm run genkit:dev

# Start Genkit with file watching
npm run genkit:watch
```

### Testing
```bash
# Run backend tests (when configured)
cd backend && npm test
```

## Architecture Overview

### Full-Stack Structure
- **Frontend**: Next.js 15 with TypeScript, TailwindCSS, Radix UI components
- **Backend**: Express.js API server with modular route structure
- **Database**: MySQL with automatic table creation
- **External APIs**: ElevenLabs integration for voice services
- **Authentication**: JWT with HTTP-only cookies

### Key Directories
```
├── src/                     # Next.js app source
│   ├── app/                 # App Router pages and layouts
│   │   ├── (app)/          # Main app pages
│   │   ├── (auth)/         # Auth-related pages
│   │   └── client-admin/   # Client admin interface
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── landing/        # Landing page components
│   │   └── [feature]/      # Feature-specific components
│   ├── lib/                # Utilities and configuration
│   │   ├── apiConfig.ts    # Centralized API configuration
│   │   └── utils.ts        # Utility functions
│   └── actions/            # Server actions
├── backend/                # Express.js backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth and other middleware
│   ├── config/             # Database and URL configuration
│   └── services/           # Business logic services
└── public/                 # Static assets
```

### API Architecture
The application uses a centralized API configuration system in `src/lib/apiConfig.ts` that:
- Automatically handles environment-based URL switching
- Provides consistent request patterns with authentication
- Supports both internal and external API integrations
- Includes built-in error handling and token management

### Backend API Structure
The backend follows a modular approach with separate route files:
- `routes/auth.js` - Authentication (login/logout)
- `routes/agents.js` - AI agent management
- `routes/clients.js` - Client management
- `routes/plans.js` - Subscription plans
- `routes/elevenlabs.js` - ElevenLabs API integration
- `routes/admin.js` - Admin user management
- And more specialized routes for features

### Database Schema
MySQL database with automatic table creation including:
- `admin_users`, `clients`, `agents` - Core entities
- `plans`, `assigned_plans` - Subscription management
- `knowledge_base`, `agent_knowledge_base` - AI knowledge management
- `languages`, `voices` - Localization and voice settings
- `user_roles`, `client_users` - Role-based access control

## Development Patterns

### Environment Configuration
- Use `setup-env-comprehensive.js` for environment setup
- Supports localhost, ngrok, and server configurations
- Environment variables automatically configured based on choice
- API base URL switches between development and production automatically

### Authentication Flow
- JWT tokens stored in HTTP-only cookies
- Separate login endpoints for admin and client users
- Role-based permissions with middleware protection
- Token storage utility in `src/lib/tokenStorage.ts`

### API Usage Pattern
```typescript
// Recommended: Use the centralized API object
import { api } from '@/lib/apiConfig';

const users = await api.getAdminUsers();
const client = await api.createClient(clientData);

// Alternative: Use apiUtils for custom endpoints
import { apiUtils } from '@/lib/apiConfig';
const response = await apiUtils.get('/api/custom-endpoint');
```

### Component Organization
- UI components in `src/components/ui/` (shadcn/ui based)
- Feature components organized by domain (e.g., `clients/`, `agents/`)
- Landing page components in `src/components/landing/`
- Form components use React Hook Form with Zod validation

### External Service Integration
- ElevenLabs API integration handled through centralized config
- Workspace secrets management for API keys
- MCP (Model Context Protocol) server support for extensible AI features

## Key Features

### Multi-User System
- Admin users with role-based permissions
- Client companies with multiple users per client  
- Sales admin with referral tracking
- Granular permission system for different user types

### AI Agent Management
- Full lifecycle management of AI voice agents
- Integration with ElevenLabs for voice synthesis
- Knowledge base assignment and management
- Advanced settings for agent behavior and voice

### Campaign Management
- Call campaign creation and tracking
- Real-time call status monitoring
- Analytics and usage reporting
- Client-specific campaign isolation

### Billing and Plans
- Flexible subscription plan system
- Usage tracking and monthly limits
- Plan assignment to clients
- ElevenLabs usage monitoring and reporting

## Environment Variables

Create `.env.local` in root for frontend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Create `.env` in backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai-caller
JWT_SECRET=your-secret-key
ELEVENLABS_API_KEY=your-api-key
PORT=5000
```

## Troubleshooting

### Common Issues
- **CORS errors**: Ensure backend is running and API_BASE_URL is correct
- **Database connection**: Verify MySQL is running and credentials are correct
- **Authentication issues**: Check JWT_SECRET is set and tokens are being sent
- **Build errors**: Run `npm run typecheck` to identify TypeScript issues

### Development Tips
- Use the setup scripts (`npm run setup:menu`) for quick environment configuration
- Backend auto-creates database tables on first run
- Frontend uses Turbopack for faster development builds
- Check browser console for API configuration debug information

## Style Guidelines

### Colors
- Primary: `#1655b5` (professional blue)
- Secondary: `#292f9b` (deep blue)
- Accent: `#FFC012` (yellow), `#6DD629` (green) for CodeCafe theme

### Typography
- Font: Inter (loaded from Google Fonts)
- Consistent heading hierarchy using Tailwind classes

### Component Patterns
- Use Radix UI primitives with custom styling
- Consistent form patterns with React Hook Form
- Loading states and error boundaries for robust UX