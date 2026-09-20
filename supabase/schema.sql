-- ============================================================
-- KisanConnect — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ───
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT UNIQUE,
  cnic        TEXT UNIQUE,
  role        TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer','buyer','agronomist','admin')),
  province    TEXT,
  district    TEXT,
  village     TEXT,
  land_acres  NUMERIC DEFAULT 0,
  avatar_url  TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MANDI PRICES ───
CREATE TABLE IF NOT EXISTS public.mandi_prices (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city        TEXT NOT NULL,
  province    TEXT NOT NULL,
  crop        TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  unit        TEXT DEFAULT 'Maund',
  change_pct  NUMERIC DEFAULT 0,
  source      TEXT DEFAULT 'manual',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, crop)
);

-- ─── LISTINGS (Marketplace) ───
CREATE TABLE IF NOT EXISTS public.listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('sell','buy')),
  crop        TEXT NOT NULL,
  crop_emoji  TEXT,
  quantity    NUMERIC NOT NULL,
  quantity_unit TEXT DEFAULT 'Maund',
  price       NUMERIC NOT NULL,
  min_order   NUMERIC DEFAULT 1,
  location    TEXT NOT NULL,
  province    TEXT NOT NULL,
  district    TEXT,
  description TEXT,
  image_url   TEXT,
  is_organic  BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LISTING CONTACTS ───
CREATE TABLE IF NOT EXISTS public.listing_contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DISEASE SCANS ───
CREATE TABLE IF NOT EXISTS public.disease_scans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url   TEXT NOT NULL,
  disease_name TEXT,
  crop        TEXT,
  confidence  NUMERIC,
  severity    TEXT CHECK (severity IN ('low','medium','high')),
  treatment   JSONB,
  location    TEXT,
  district    TEXT,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FORUM POSTS ───
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  title_urdu  TEXT,
  body        TEXT NOT NULL,
  body_urdu   TEXT,
  category    TEXT NOT NULL DEFAULT 'General',
  tags        TEXT[],
  images      TEXT[],
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_answered BOOLEAN DEFAULT false,
  is_pinned   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FORUM REPLIES ───
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  body_urdu   TEXT,
  likes_count INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── POST LIKES ───
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id     UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- ─── LOAN APPLICATIONS ───
CREATE TABLE IF NOT EXISTS public.loan_applications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheme_name TEXT NOT NULL,
  bank_name   TEXT NOT NULL,
  amount      NUMERIC NOT NULL,
  purpose     TEXT,
  land_acres  NUMERIC,
  crop        TEXT,
  cnic        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  province    TEXT,
  village     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CROP PLANS ───
CREATE TABLE IF NOT EXISTS public.crop_plans (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  crop         TEXT NOT NULL,
  district     TEXT NOT NULL,
  land_acres   NUMERIC NOT NULL,
  soil_type    TEXT,
  irrigation   TEXT,
  sowing_date  DATE,
  harvest_date DATE,
  events       JSONB DEFAULT '[]',
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  link        TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_scans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only own
CREATE POLICY "Profiles are viewable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Mandi prices: public read, admin write
CREATE POLICY "Mandi prices are public" ON public.mandi_prices FOR SELECT USING (true);

-- Listings: public read, auth write
CREATE POLICY "Listings public read"  ON public.listings FOR SELECT USING (true);
CREATE POLICY "Listings auth insert"  ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Listings own update"   ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Listings own delete"   ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Disease scans: own data
CREATE POLICY "Disease scans public read"  ON public.disease_scans FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Disease scans auth insert"  ON public.disease_scans FOR INSERT WITH CHECK (true);

-- Forum posts: public read, auth write
CREATE POLICY "Forum posts public"    ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Forum posts auth insert" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Forum posts own update"  ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- Forum replies
CREATE POLICY "Replies public read"   ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Replies auth insert"   ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Post likes
CREATE POLICY "Post likes public"     ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Post likes auth"       ON public.post_likes FOR ALL USING (auth.uid() = user_id);

-- Loan applications: own only
CREATE POLICY "Loans own read"    ON public.loan_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Loans auth insert" ON public.loan_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crop plans: own only
CREATE POLICY "Crop plans own"    ON public.crop_plans FOR ALL USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Notifications own" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ────────────────────────────────────────
-- SEED DATA — Real Pakistani Mandi Prices
-- ────────────────────────────────────────
INSERT INTO public.mandi_prices (city, province, crop, price, change_pct) VALUES
  ('Lahore',       'Punjab',      'Wheat',           3850, 2.4),
  ('Lahore',       'Punjab',      'Rice (Basmati)',   6200, 1.1),
  ('Lahore',       'Punjab',      'Maize',            2600, 0.6),
  ('Faisalabad',   'Punjab',      'Cotton',          12400, 3.2),
  ('Faisalabad',   'Punjab',      'Wheat',            3780, 1.8),
  ('Multan',       'Punjab',      'Mango',            4200,-1.5),
  ('Multan',       'Punjab',      'Cotton',          12100, 2.9),
  ('Gujranwala',   'Punjab',      'Rice (Basmati)',   6350, 1.5),
  ('Sialkot',      'Punjab',      'Wheat',            3800, 1.2),
  ('Bahawalpur',   'Punjab',      'Cotton',          11900, 2.1),
  ('Rawalpindi',   'Punjab',      'Potato',           1900,-0.5),
  ('Karachi',      'Sindh',       'Onion',            2100,-3.2),
  ('Karachi',      'Sindh',       'Tomato',           3500, 4.1),
  ('Hyderabad',    'Sindh',       'Banana',           1900,-1.0),
  ('Larkana',      'Sindh',       'Rice (Irri)',       3800, 0.9),
  ('Sukkur',       'Sindh',       'Sugarcane',         370,-0.8),
  ('Nawabshah',    'Sindh',       'Wheat',            3700, 1.6),
  ('Peshawar',     'KPK',         'Potato',           1800,-2.1),
  ('Peshawar',     'KPK',         'Tobacco',          8500, 4.2),
  ('Mardan',       'KPK',         'Maize',            2550, 0.4),
  ('Swat',         'KPK',         'Apple',            4800, 2.0),
  ('Quetta',       'Balochistan', 'Apple',            5200, 2.8),
  ('Quetta',       'Balochistan', 'Pomegranate',      6800, 1.9),
  ('Turbat',       'Balochistan', 'Date Palm',        9800, 1.5)
ON CONFLICT (city, crop) DO UPDATE SET price = EXCLUDED.price, change_pct = EXCLUDED.change_pct, updated_at = NOW();

-- ────────────────────────────────────────
-- FUNCTIONS
-- ────────────────────────────────────────

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Kisan User'),
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment views on post read
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
  UPDATE public.forum_posts SET views_count = views_count + 1 WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Toggle like on post
CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id UUID, p_user_id UUID)
RETURNS json AS $$
DECLARE
  already_liked BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM post_likes WHERE post_id = p_post_id AND user_id = p_user_id) INTO already_liked;
  IF already_liked THEN
    DELETE FROM post_likes WHERE post_id = p_post_id AND user_id = p_user_id;
    UPDATE forum_posts SET likes_count = likes_count - 1 WHERE id = p_post_id;
    RETURN json_build_object('liked', false);
  ELSE
    INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, p_user_id);
    UPDATE forum_posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
    RETURN json_build_object('liked', true);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
