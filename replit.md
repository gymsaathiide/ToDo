# TaskFlow - Modern Todo Application

## Overview

TaskFlow is a production-ready todo application built with a modern full-stack architecture. The application provides user authentication via Supabase Auth with email OTP verification, user profiles with avatar upload, secure task management with Row Level Security, and a clean responsive UI.

**Core Features:**
- User authentication with email OTP verification (Supabase Auth)
- User profiles with avatar photo upload (Supabase Storage)
- CRUD operations for todos (create, read, update, delete)
- User-specific data isolation via RLS policies
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
- **Auth & Data:** Supabase JavaScript client for auth, database, and storage

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **HTTP Server:** Node.js HTTP server
- **API Pattern:** Minimal - only serves Supabase config endpoint
- **Note:** Most logic runs client-side with Supabase

### Data Storage
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password with OTP verification)
- **File Storage:** Supabase Storage (avatar images)
- **Data Access:** Direct from frontend using Supabase client with RLS

## Supabase Setup Instructions

### Step 1: Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Copy your project URL and anon key from Settings > API
3. Add to Replit secrets:
   - `SUPABASE_URL` - Your project URL
   - `SUPABASE_ANON_KEY` - Your anon/public key

### Step 2: Enable Email Auth with OTP
1. Go to **Authentication > Providers > Email**
2. Enable Email provider
3. **IMPORTANT: Enable "Confirm email"** - This enables email verification
4. Go to **Authentication > Email Templates**
5. For the "Confirm signup" template, ensure it includes the OTP token:
   - The template should include `{{ .Token }}` which is the 6-digit OTP code
   - Example template:
   ```
   <h2>Confirm your email</h2>
   <p>Your verification code is: <strong>{{ .Token }}</strong></p>
   <p>Enter this code in the app to verify your email.</p>
   <p>Or click this link: <a href="{{ .ConfirmationURL }}">Verify Email</a></p>
   ```

### Step 3: Run Database SQL
Run this SQL in SQL Editor (supabase.com/dashboard > SQL Editor):

```sql
-- =============================================
-- PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- TODOS TABLE
-- =============================================
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);
```

### Step 4: Create Storage Bucket for Avatars
1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name it `avatars`
4. Make it public (for easy avatar display)
5. Add these policies in Storage > Policies:

**Policy 1: Allow authenticated users to upload their own avatar**
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Allow users to update/delete their own avatar**
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3: Allow public read access (for displaying avatars)**
```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## Authentication Flow

1. **Sign Up**: User enters email, password, and optional name
2. **Email Verification**: Supabase sends a 6-digit OTP code to the user's email
3. **Verify OTP**: User enters the code in the app to verify their account
4. **Sign In**: After verification, user can sign in with email/password
5. **Session**: Session persists across page refreshes
6. **Sign Out**: Clears session and redirects to auth page

## API Endpoints
- `GET /api/config` - Get Supabase configuration (URL and anon key)

## Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server, Vite builds client to `dist/`

## External Dependencies

### Supabase Services
- **Supabase Auth:** Email/password authentication with OTP verification
- **Supabase Database:** PostgreSQL with RLS for secure data access
- **Supabase Storage:** File storage for user avatars

### Required Secrets
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous/public key

### UI Components
- **Radix UI:** Headless UI primitives
- **Lucide React:** Icon library
- **class-variance-authority:** Component variant management
- **tailwind-merge:** Tailwind class merging utility

## Troubleshooting

### OTP not working
1. Make sure "Confirm email" is enabled in Authentication > Providers > Email
2. Check your spam folder for the verification email
3. The OTP code is valid for 1 hour
4. You can resend the code using the "Resend verification code" button

### No user data in Supabase
1. Make sure you ran the SQL to create the `profiles` and `todos` tables
2. Check that RLS policies are enabled and correct
3. Verify your Supabase URL and anon key are correctly set in Replit secrets
