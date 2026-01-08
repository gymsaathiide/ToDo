# TaskFlow - Modern Todo Application

A production-ready todo application built with React, TypeScript, and Supabase.

## Features

- User authentication with email OTP verification
- User profiles with avatar upload
- Create, read, update, and delete todos
- User-specific data isolation with Row Level Security
- Dark/light theme support
- Responsive design

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Express.js (minimal - serves config only)
- **Database:** Supabase (PostgreSQL with RLS)
- **Authentication:** Supabase Auth (email/password with OTP)
- **Storage:** Supabase Storage (avatar images)

## Getting Started

### Prerequisites

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API

### Environment Variables

Add these to your environment:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Enable Email provider in Authentication > Providers
2. Enable "Confirm email" for OTP verification
3. Run the SQL in Supabase SQL Editor to create tables and RLS policies (see setup instructions below)
4. Create an `avatars` storage bucket with public read access

### Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos" ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON todos FOR DELETE USING (auth.uid() = user_id);
```

### Installation

```bash
npm install
npm run dev
```

## Usage

1. Sign up with your email and password
2. Enter the 8-digit verification code sent to your email
3. Start creating and managing your todos
4. Upload a profile avatar in the header menu

## License

MIT
