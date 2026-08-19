# UNTIL - Say it now. Reveal it later.

UNTIL is a web platform where users can create content today, lock it, choose a future date/time when it will be revealed, and share a public countdown link.

## Architecture

- **Frontend**: Next.js 16 App Router, React 19
- **Styling**: Vanilla CSS (`globals.css`)
- **Backend/Auth**: Supabase (PostgreSQL, Supabase Auth)
- **Encryption**: Application-level AES encryption using `crypto-js`
- **Cron Jobs**: Vercel Cron or standard API polling at `/api/cron/reveal`

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file based on `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ENCRYPTION_KEY=a-secure-32-character-key
```

### 2. Supabase Setup
Run the following SQL in your Supabase SQL Editor to set up the tables:

```sql
-- Create posts table
CREATE TABLE posts (
  id uuid default gen_random_uuid() primary key,
  public_id text unique not null,
  user_id uuid references auth.users not null,
  title text,
  post_type text default 'Prediction',
  encrypted_content text not null,
  content_hash text not null,
  media_path text,
  reveal_at timestamptz not null,
  user_timezone text,
  status text check (status in ('LOCKED', 'REVEALED')) not null default 'LOCKED',
  locked_at timestamptz not null default now(),
  revealed_at timestamptz,
  views integer default 0,
  created_at timestamptz default now()
);

-- Create reminders table
CREATE TABLE reminders (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  email text not null,
  notified boolean default false,
  created_at timestamptz default now(),
  unique(post_id, email)
);

-- Create guesses table
CREATE TABLE guesses (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_name text not null,
  guess_text text not null,
  created_at timestamptz default now()
);

-- Create storage bucket
insert into storage.buckets (id, name, public) values ('locked_media', 'locked_media', false);
```

### 3. Local Development
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open `http://localhost:3000`

### 4. Scheduled Worker Setup (Cron)
To automatically reveal posts, you must ping the endpoint `GET /api/cron/reveal` every minute.
If deploying on Vercel, create a `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reveal",
      "schedule": "* * * * *"
    }
  ]
}
```
You also need to pass the `Authorization: Bearer <CRON_SECRET>` if you set a `CRON_SECRET` env var.

### Testing
Use Playwright or Jest to verify the core flows:
- Authentication
- Locking post (content should be encrypted in DB)
- Checking public page URL (should show countdown)
- Triggering `/api/cron/reveal` locally and seeing the post state change to REVEALED.

## Next Steps
- Integrate real email sending (e.g. Resend) in `/api/cron/reveal/route.ts` instead of mock logs.
- Fine-tune RLS (Row Level Security) policies in Supabase.
- Enhance media validation (mime-type checking).
