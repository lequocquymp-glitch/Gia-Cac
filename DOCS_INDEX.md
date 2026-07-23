# Documentation Index

Hướng dẫn đầy đủ để dùng, phát triển, và deploy Gia Các Command Center.

---

## 📋 Start Here

### 1️⃣ **First Time Setup** (5 minutes)
→ Read: [`QUICKSTART.md`](QUICKSTART.md)

**What**: How to run locally and deploy to production
**For**: Everyone - start here!

### 2️⃣ **I Want to Deploy NOW** (15 minutes)
→ Read: [`DEPLOY.md`](DEPLOY.md)

**What**: Step-by-step Vercel + Supabase deployment
**For**: Ready for production

### 3️⃣ **I Want to Develop Locally** (5 minutes)
→ Read: [`SETUP.md`](SETUP.md)

**What**: Local dev environment, database, npm commands
**For**: Developers

---

## 📚 Full Documentation

### Overview
| Doc | Purpose | Audience |
|-----|---------|----------|
| [`README.md`](README.md) | Features & tech stack overview | Everyone |
| [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) | What was built, metrics, status | Project managers |
| [`IMPLEMENTATION.md`](IMPLEMENTATION.md) | Technical architecture decisions | Developers |

### Setup & Deployment
| Doc | Purpose | Audience |
|-----|---------|----------|
| [`QUICKSTART.md`](QUICKSTART.md) | 15-min production deployment | New users |
| [`DEPLOY.md`](DEPLOY.md) | Detailed Vercel + Supabase guide | DevOps/Deployment |
| [`SETUP.md`](SETUP.md) | Local development environment | Developers |

### This File
| Doc | Purpose |
|-----|---------|
| [`DOCS_INDEX.md`](DOCS_INDEX.md) | You are here! Documentation map |

---

## 🚀 Common Scenarios

### "I just downloaded the repo"
1. Read [`QUICKSTART.md`](QUICKSTART.md) - Part 1
2. Run `npm run dev`
3. Explore at http://localhost:3000

### "I want to deploy to production"
1. Read [`QUICKSTART.md`](QUICKSTART.md) - Part 2, or
2. Follow [`DEPLOY.md`](DEPLOY.md) step-by-step

### "I want to understand the architecture"
1. Read [`README.md`](README.md)
2. Read [`IMPLEMENTATION.md`](IMPLEMENTATION.md)
3. Explore code in `app/`, `components/`, `lib/`

### "I want to develop a new feature"
1. Read [`SETUP.md`](SETUP.md)
2. Create feature branch: `git checkout -b feature-name`
3. Run `npm run dev`
4. Make changes
5. Test locally
6. Commit & push
7. Create PR or merge to main

### "I'm working with ChatGPT on this project"
1. Read [`QUICKSTART.md`](QUICKSTART.md) - Collaboration section
2. Use Git branches to avoid conflicts
3. Merge carefully to main

---

## 📁 File Structure Guide

```
gia-cac/
├── 📄 QUICKSTART.md          ← Start here!
├── 📄 DEPLOY.md              ← Deploy to production
├── 📄 SETUP.md               ← Local development
├── 📄 README.md              ← Features overview
├── 📄 IMPLEMENTATION.md       ← Technical details
├── 📄 PROJECT_SUMMARY.md     ← What was built
├── 📄 DOCS_INDEX.md          ← You are here
│
├── 📁 app/                   ← Next.js pages & API
│   ├── layout.tsx
│   └── (app)/
│       ├── page.tsx          ← Home dashboard
│       ├── projects/
│       ├── search/
│       └── settings/
├── 📁 components/            ← React components
├── 📁 lib/                   ← Utilities
├── 📁 types/                 ← TypeScript types
├── 📁 prisma/                ← Database schema
│   ├── schema.prisma
│   └── seed.ts
├── 📁 public/                ← Static assets
│
├── package.json              ← Dependencies
├── tsconfig.json             ← TypeScript config
├── next.config.ts            ← Next.js config
└── .env.local                ← Environment variables
```

---

## 🔍 Quick Reference

### Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build

# Database
npm run db:push         # Create/migrate database
npm run db:seed         # Load sample data
npm run db:studio       # Open database GUI

# Git
git push                # Deploy to Vercel (if connected)
git checkout -b name    # Create feature branch
```

### URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Local development |
| https://gia-cac.vercel.app | Production (after deploy) |
| http://localhost:5555 | Database GUI (`npm run db:studio`) |
| https://supabase.com | Production database |
| https://vercel.com | Production hosting |

### Important Files

| File | What it does |
|------|-------------|
| `app/(app)/page.tsx` | Home dashboard |
| `components/home/QuickCapture.tsx` | Add task feature |
| `prisma/schema.prisma` | Database definition |
| `app/api/*/route.ts` | API endpoints |
| `.env.local` | Environment variables |

---

## ❓ FAQ

### How do I add a new feature?
1. Modify code
2. Test locally: `npm run dev`
3. Commit: `git commit -m "description"`
4. Push: `git push` (auto-deploys to Vercel)

### How do I update the database?
1. Edit `prisma/schema.prisma`
2. Run: `npm run db:push`
3. Restart dev server: `npm run dev`

### How do I view the database?
```bash
npm run db:studio
# Opens http://localhost:5555
```

### How do I backup my data?
- Supabase auto-backups (free tier)
- Or export via Settings → "Export Data"

### How do I deploy?
See [`QUICKSTART.md`](QUICKSTART.md) - Part 2 (15 minutes)

### What if something breaks?
1. Check server logs: `npm run dev`
2. Check database: `npm run db:studio`
3. See troubleshooting in [`SETUP.md`](SETUP.md) or [`DEPLOY.md`](DEPLOY.md)

---

## 📊 Project Status

| Phase | Status | Features |
|-------|--------|----------|
| Phase 1 | ✅ Complete | Home, Projects, Search, Settings |
| Phase 2 | ⬜ Planned | Calendar, Kanban, Gantt, Notifications |
| Phase 3 | ⬜ Planned | Multi-user, Teams, Integrations |

---

## 🎯 Key Principles

1. **Simple Architecture** - No over-engineering
2. **Type-Safe** - 100% TypeScript
3. **Production-Ready** - Error handling, tested
4. **Scalable** - Phase 2 doesn't need refactoring
5. **Well-Documented** - You're reading it!

---

## 📞 Getting Help

1. **For setup issues** → See [`SETUP.md`](SETUP.md)
2. **For deployment issues** → See [`DEPLOY.md`](DEPLOY.md)
3. **For feature questions** → See [`IMPLEMENTATION.md`](IMPLEMENTATION.md)
4. **For feature requests** → Modify code and push to GitHub
5. **For technical help** → Check the code comments

---

## 🚀 Next Steps

1. **Read** [`QUICKSTART.md`](QUICKSTART.md)
2. **Try** `npm run dev`
3. **Deploy** following [`DEPLOY.md`](DEPLOY.md)
4. **Share** the live URL
5. **Enjoy** using Gia Các Command Center!

---

**Happy building!** 🎉

Last updated: July 23, 2026
