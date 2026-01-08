# TaskFlow - Modern Todo Application

## Overview

TaskFlow is a production-ready todo application built with a modern full-stack architecture. The application provides user authentication via Replit Auth, secure task management with user isolation, and a clean, responsive UI inspired by Linear and Todoist.

**Core Features:**
- User authentication (login, signup, logout via Replit Auth)
- CRUD operations for todos (create, read, update, delete)
- User-specific data isolation (users can only access their own todos)
- Dark/light theme support
- Responsive design with mobile support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with hot module replacement
- **Routing:** Wouter (lightweight React router)
- **State Management:** TanStack React Query for server state
- **Styling:** Tailwind CSS with CSS variables for theming
- **Component Library:** shadcn/ui (Radix UI primitives with custom styling)
- **Path Aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **HTTP Server:** Node.js HTTP server
- **API Pattern:** RESTful endpoints under `/api/` prefix
- **Authentication:** Replit Auth with OpenID Connect, session-based with PostgreSQL session store
- **Middleware:** JSON body parsing, session management, authentication guards

### Data Storage
- **Database:** PostgreSQL via Drizzle ORM
- **Schema Location:** `shared/schema.ts` (shared between frontend and backend)
- **Session Storage:** PostgreSQL table (`sessions`) for session persistence
- **Migrations:** Drizzle Kit with `db:push` command

### Database Schema
- **users:** id, email, firstName, lastName, profileImageUrl, timestamps
- **sessions:** sid, sess (JSONB), expire (for Replit Auth session storage)
- **todos:** id (UUID), userId (foreign key), title, isCompleted, createdAt

### Authentication Flow
- Replit Auth integration using OpenID Connect
- Session stored in PostgreSQL with `connect-pg-simple`
- Protected routes require `isAuthenticated` middleware
- User data extracted from JWT claims (`req.user.claims.sub`)

### API Endpoints
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server, Vite builds client to `dist/`
- Server bundle includes common dependencies for faster cold starts

## External Dependencies

### Database
- **PostgreSQL:** Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM:** Type-safe database queries and schema management

### Authentication
- **Replit Auth:** OpenID Connect provider for user authentication
- **Required Environment Variables:**
  - `DATABASE_URL` - PostgreSQL connection string
  - `SESSION_SECRET` - Secret for session encryption
  - `REPL_ID` - Replit environment identifier
  - `ISSUER_URL` - OpenID Connect issuer (defaults to Replit)

### UI Components
- **Radix UI:** Headless UI primitives (dialogs, dropdowns, checkboxes, etc.)
- **Lucide React:** Icon library
- **class-variance-authority:** Component variant management
- **tailwind-merge:** Tailwind class merging utility

### Session Management
- **express-session:** Session middleware
- **connect-pg-simple:** PostgreSQL session store
- **memoizee:** Caching for OIDC configuration