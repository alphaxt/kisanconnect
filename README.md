# KisanConnect — Pakistan Agricultural Intelligence Platform

A production-ready, full-stack Next.js application empowering 22 million Pakistani farmers.

## 🚀 Quick Start

```bash
git clone https://github.com/alphaxt/kisanconnect.git
cd kisanconnect
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

### Required Environment Variables

| Variable | Where to Get | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | ✅ |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | openweathermap.org (free) | Optional |

---

## 🗄️ Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor**
3. Copy and run the contents of `supabase/schema.sql`
4. Go to **Storage** → Create bucket named `disease-images` → Set to **Public**
5. Go to **Authentication** → Enable **Email**, **Phone (SMS)**, and **Google** providers
6. Copy your Project URL and keys to `.env.local`

---

## 🌤️ Weather API (Optional but Recommended)

1. Go to [openweathermap.org](https://openweathermap.org/api) → Free account
2. Get your API key (free: 1M calls/month)
3. Add to `.env.local` as `NEXT_PUBLIC_OPENWEATHER_API_KEY`

**Without API key**: App shows realistic mock weather data — still fully functional.

---

## 🚀 Deploy to Vercel (Production)

### Option 1: Vercel CLI (Fastest)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: GitHub → Vercel (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "🌿 KisanConnect v1.0 - Production Ready"
git remote add origin https://github.com/YOUR_USERNAME/kisanconnect.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add Environment Variables (copy from `.env.local`)
4. Click **Deploy** → Live in 2 minutes!

---

## 📁 Project Structure

```
kisanconnect-prod/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Real email + OTP login
│   │   ├── register/page.tsx       # Role-based registration
│   │   └── callback/route.ts       # OAuth callback
│   ├── api/
│   │   ├── weather/route.ts        # OpenWeatherMap integration
│   │   ├── mandi-prices/route.ts   # Real mandi price API
│   │   ├── listings/route.ts       # Marketplace CRUD
│   │   ├── forum/route.ts          # Community API
│   │   ├── disease-scan/route.ts   # AI disease scanner
│   │   └── loans/route.ts          # Loan applications
│   ├── dashboard/page.tsx          # Live prices + charts
│   ├── marketplace/page.tsx        # Buy/sell listings
│   ├── disease/page.tsx            # Disease AI scanner
│   ├── loans/page.tsx              # Loan finder + apply
│   ├── community/page.tsx          # Forum
│   └── planner/page.tsx            # Crop planner
├── components/
│   ├── Navbar.tsx                  # Real auth-aware navbar
│   ├── providers/AuthProvider.tsx  # Supabase auth context
│   └── landing/                   # Landing page sections
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   └── server.ts              # Server Supabase client
│   └── types.ts                   # TypeScript interfaces
├── supabase/
│   └── schema.sql                 # Full database schema + seed data
├── vercel.json                    # Deployment config
└── .env.local                     # Environment variables
```

---

## 🔑 Features

| Feature | Status | Technology |
|---------|--------|------------|
| Email/Password Auth | ✅ Real | Supabase Auth |
| Phone OTP Login | ✅ Real | Supabase Auth |
| Google OAuth | ✅ Real | Supabase OAuth |
| Email Verification | ✅ Real | Supabase |
| Mandi Prices | ✅ Real DB | PostgreSQL |
| Weather Data | ✅ Real API | OpenWeatherMap |
| Marketplace Listings | ✅ Real DB | PostgreSQL |
| Disease Image Upload | ✅ Real | Supabase Storage |
| AI Disease Detection | ✅ Real | Pluggable ML |
| Community Forum | ✅ Real DB | PostgreSQL + RLS |
| Loan Applications | ✅ Real DB | PostgreSQL |
| Notifications | ✅ Real | Supabase |
| Deployment | ✅ Ready | Vercel |

---

## 🛡️ Security

- Row Level Security (RLS) on all database tables
- JWT-based authentication via Supabase
- CNIC and phone validation
- SQL injection prevention via parameterized queries
- XSS prevention via React's built-in escaping
- Rate limiting via Vercel Edge

---

Built with 💚 for Pakistan's farmers | © 2026 KisanConnect
