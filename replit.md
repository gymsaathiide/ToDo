# TaskFlow - Modern Todo Application

## Overview

TaskFlow is a production-ready todo application built with a modern full-stack architecture. The application provides user authentication via Supabase Auth, secure task management with user isolation using Supabase Row Level Security, and a clean, responsive UI inspired by Linear and Todoist.

**Core Features:**
- User authentication (login, signup, logout via Supabase Auth)
- CRUD operations for todos (create, read, update, delete)
- User-specific data isolation (users can only access their own todos via RLS)
- Dark/light theme support
- Responsive design with mobile support
- Visible sign out button in header

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
- **Auth & Data:** Supabase JavaScript client for auth and database operations

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **HTTP Server:** Node.js HTTP server
- **API Pattern:** Minimal - only serves Supabase config endpoint
- **Note:** Most logic runs client-side with Supabase

### Data Storage
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Data Access:** Direct from frontend using Supabase client with RLS

### Supabase Database Schema
**todos table:**
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own todos
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own todos
CREATE POLICY "Users can insert own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own todos
CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);
```

### API Endpoints
- `GET /api/config` - Get Supabase configuration (URL and anon key)

### Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server, Vite builds client to `dist/`
- Server bundle includes common dependencies for faster cold starts

## External Dependencies

### Supabase
- **Supabase URL:** Project URL from Supabase dashboard
- **Supabase Anon Key:** Public API key from Supabase dashboard
- **Required Secrets:**
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Supabase anonymous/public key

### UI Components
- **Radix UI:** Headless UI primitives (dialogs, dropdowns, checkboxes, etc.)
- **Lucide React:** Icon library
- **class-variance-authority:** Component variant management
- **tailwind-merge:** Tailwind class merging utility

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Add SUPABASE_URL and SUPABASE_ANON_KEY to Replit secrets
3. Run the SQL above in Supabase SQL Editor to create the todos table with RLS
4. Enable email auth in Supabase (Auth > Providers > Email)
