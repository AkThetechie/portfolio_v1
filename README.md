# R Akash — Portfolio Website

Dark, techy portfolio with a Supabase-powered admin panel.

---

## Setup in 5 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
1. Go to https://supabase.com and create a free account
2. Create a new project (choose Mumbai region)
3. Go to **Project Settings → API**
4. Copy your **Project URL** and **anon public** key

### 3. Set environment variables
```bash
cp .env.example .env
```
Fill in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run this SQL in Supabase
Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  tagline text,
  description text,
  domain text,
  tags text[],
  status text default 'draft',
  cover_image_url text,
  images text[],
  components text[],
  challenges text,
  outcome text,
  github_url text,
  video_url text,  -- reserved for future video support
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: public can read published projects
alter table projects enable row level security;

create policy "Public can view published projects"
  on projects for select
  using (status = 'published');

create policy "Auth users can do everything"
  on projects for all
  using (auth.role() = 'authenticated');

-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Auth users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Auth users can delete images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');
```

### 5. Create your admin account
1. In Supabase dashboard go to **Authentication → Users**
2. Click **Add user**
3. Enter your email and a strong password
4. That's your login — no registration UI needed

---

## Run locally
```bash
npm run dev
```
Visit http://localhost:5173

Admin panel: http://localhost:5173/admin/login

---

## Deploy to Netlify
1. Push this repo to GitHub
2. Go to https://netlify.com → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in **Site settings → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

---

## Adding projects
1. Go to `/admin/login`
2. Sign in with your Supabase credentials
3. Click **New Project**
4. Fill in details, upload images, set status to **Published**

---

## TODO (future features)
- [ ] Video upload support (video_url column already in DB — add UI in ProjectForm and ProjectDetail)
- [ ] Dark/light mode toggle
- [ ] Resume PDF download link
- [ ] Project view count
