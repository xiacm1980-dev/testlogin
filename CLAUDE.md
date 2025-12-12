# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aegis CDR (Content Disarm & Reconstruction) System - A React-based security administration platform with role-based access control, file/video content cleaning, threat protection, and audit logging capabilities.

**Tech Stack**: React 19, TypeScript, Vite, TailwindCSS (via inline classes), Lucide icons, Recharts

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Architecture & Key Concepts

### Role-Based Access Control (RBAC)

The application implements a strict four-role hierarchy defined in `types.ts`:

- **SYSADMIN**: System configuration, user management, API settings, backups
- **SECADMIN**: Security policies, threat protection, video/file CDR operations
- **LOGADMIN**: Log audit, admin operation logs, reports generation
- **USER**: General users with limited access to File CDR only

Each view component enforces permissions in `App.tsx` via the `renderContent()` function. Unauthorized access attempts show the `<Unauthorized />` component.

### Session Management

- User sessions persist via `sessionStorage` with key `aegis_user_session`
- Session structure: `{ username, role, avatar, name }`
- Default admin passwords: `123456` for all admin roles
- General users authenticate against backend-stored credentials

### Backend Service (`services/backend.ts`)

A mock backend service that simulates database operations using in-memory storage:

- **Tasks**: File and video cleaning tasks with progress tracking
- **Logs**: System and admin operation logs with severity levels
- **Users**: General user management with CRUD operations
- **System Stats**: CPU, memory, disk, services monitoring
- **Threat Stats**: Real-time attack metrics and mitigation
- **Reports**: Generated audit/traffic/compliance reports
- **Policies**: Security policy rules management

Key methods:
- `addTask()`, `getFileTasks()`, `getVideoTasks()` - Task management
- `loginUser()`, `changePassword()` - Authentication logging
- `addLog()`, `getSystemLogs()`, `getAdminLogs()` - Audit trail
- `getSystemStats()`, `getThreatStats()` - Real-time metrics
- `addGeneralUser()`, `updateGeneralUser()`, `deleteGeneralUser()` - User CRUD

### Internationalization (i18n)

Bilingual support (English/Chinese) implemented in `i18n.tsx`:

- `useLanguage()` hook provides `{ language, setLanguage, t }`
- Translation keys follow dot notation: `'menu.dashboard'`, `'user.name'`
- Dynamic translations support params: `t('log.msg.login_success', { user: 'admin' })`
- Language toggle available in header for all roles

### Component Structure

```
App.tsx                    # Main app with routing, auth, RBAC
├── components/
│   ├── Login.tsx          # Two-mode login (admin roles + general users)
│   ├── Sidebar.tsx        # Role-based navigation menu
│   └── views/
│       ├── Dashboard.tsx        # System overview (admin only)
│       ├── SystemConfig.tsx     # System settings & backups (SYSADMIN)
│       ├── UserManagement.tsx   # General user CRUD (SYSADMIN)
│       ├── ApiSettings.tsx      # API key management (SYSADMIN)
│       ├── SecurityPolicies.tsx # Firewall rules (SECADMIN)
│       ├── ThreatProtection.tsx # DDoS mitigation (SECADMIN)
│       ├── VideoStream.tsx      # Video CDR tasks (SECADMIN)
│       ├── FileCleaning.tsx     # File CDR tasks (SECADMIN + USER)
│       ├── LogAudit.tsx         # System/admin logs (LOGADMIN)
│       └── Reports.tsx          # Report generation (LOGADMIN)
```

### View Access Matrix

| View              | SYSADMIN | SECADMIN | LOGADMIN | USER |
|-------------------|----------|----------|----------|------|
| Dashboard         | ✓        | ✓        | ✓        | ✗    |
| System Config     | ✓        | ✗        | ✗        | ✗    |
| User Management   | ✓        | ✗        | ✗        | ✗    |
| API Settings      | ✓        | ✗        | ✗        | ✗    |
| Security Policies | ✗        | ✓        | ✗        | ✗    |
| Threat Protection | ✗        | ✓        | ✗        | ✗    |
| Video CDR         | ✗        | ✓        | ✗        | ✗    |
| File CDR          | ✗        | ✓        | ✗        | ✓    |
| System Logs       | ✗        | ✓        | ✓        | ✗    |
| Admin Logs        | ✗        | ✗        | ✓        | ✗    |
| Reports           | ✗        | ✗        | ✓        | ✗    |

### Layout Differences

**Admin roles** (SYSADMIN/SECADMIN/LOGADMIN):
- Full sidebar navigation
- Top header with breadcrumb, language toggle, password change, user avatar
- Dashboard-centric workflow

**General USER role**:
- Simplified header-only layout (no sidebar)
- Direct access to File CDR
- Account modal with two tabs: Basic Info (editable name/contact) + Password Change

### Data Flow Patterns

1. **Task Submission** (File/Video CDR):
   - User submits file → `backend.addTask()`
   - Task enters UPLOADING → SCANNING → CLEAN/MALICIOUS
   - Progress updates simulate multi-stage processing
   - `currentStep` uses translation keys for internationalization

2. **Logging**:
   - All critical actions call `backend.addLog()` with severity, module, messageKey
   - Logs support parameterized messages for i18n
   - Two log types: System logs (technical) vs Admin logs (user actions)

3. **Reports**:
   - Generated on-demand via `backend.generateReport()`
   - Stored as text content with metadata
   - Types: AUDIT, TRAFFIC, COMPLIANCE

## Configuration

### Environment Variables

Create `.env.local` at project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

Accessed in code as `process.env.GEMINI_API_KEY` (configured in `vite.config.ts`).

### Import Aliases

TypeScript path alias `@/*` maps to project root:

```typescript
import { backend } from '@/services/backend';
import { Role } from '@/types';
```

## Key Files

- `App.tsx` - Main application logic, routing, RBAC enforcement, session handling
- `types.ts` - Core TypeScript interfaces (Role, View, User, GeneralUser, LogEntry, etc.)
- `constants.ts` - Mock data, role colors, initial policy rules
- `i18n.tsx` - Internationalization context and translations
- `services/backend.ts` - Mock backend service with all business logic
- `vite.config.ts` - Vite configuration (port 3000, path aliases, env injection)

## Development Notes

- All styling uses inline TailwindCSS classes (no separate CSS files)
- Mock backend data resets on page refresh (no persistence)
- Default admin password is `123456` for quick testing
- Components use `useLanguage()` hook for all user-facing text
- Task progress simulation uses `setInterval` for realistic scanning effects
- Log entries use translation keys (`messageKey`) rather than hardcoded strings
