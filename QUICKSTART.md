# Quick Start Guide - Gia Các Command Center

## Local Development (Ngay lập tức)

### 1. Start Development Server
```bash
cd gia-cac
npm run dev
```
Mở http://localhost:3000

### 2. Use the App
- **Add Task**: Type trong "Quick capture..." box, press Enter
- **Complete Task**: Click checkbox ✓
- **Create Project**: Go to Projects → "New Project"
- **Add Knowledge**: Project detail → Knowledge tab → "Add knowledge"
- **Search**: Go to Search page, type

### 3. View Database (Optional)
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

---

## Deploy to Production (Miễn phí, 24/7)

### Prerequisites
- GitHub account (free)
- Supabase account (free)
- Vercel account (auto-login với GitHub)

### Steps (15 minutes)

#### Step 1: Setup Database

1. Go to https://supabase.com → Sign up
2. Create new project:
   - Name: `gia-cac`
   - Set password
   - Region: Singapore/Tokyo
3. Wait for database creation (~2 min)
4. Click **"Connect"** → Copy connection string
5. Save connection string (dạng: `postgresql://postgres:PASSWORD@db.gia-cac.supabase.co:5432/postgres`)

#### Step 2: Push to GitHub

```bash
cd gia-cac

# Create GitHub repo first at https://github.com/new
# Name: gia-cac

git remote add origin https://github.com/YOUR_USERNAME/gia-cac.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Select `gia-cac` repository
3. Click **"Import"**
4. Add Environment Variable:
   - Name: `DATABASE_URL`
   - Value: (Paste connection string từ Supabase)
   - Click **"Add"**
5. Click **"Deploy"**

Wait 1-2 minutes → App deployed!

#### Step 4: Initialize Database

```bash
# Set environment variable
$env:DATABASE_URL = "postgresql://postgres:PASSWORD@db.gia-cac.supabase.co:5432/postgres"

# Push schema
npm run db:push

# Load sample data
npm run db:seed
```

#### Step 5: Test Live

1. Vercel shows URL (e.g., `gia-cac.vercel.app`)
2. Open it in browser
3. Add task → Should work!
4. Tắt laptop, mở lại → Dữ liệu vẫn trong!

✅ **Xong!** App chạy 24/7, miễn phí, dữ liệu persistent.

---

## Features Checklist

### Home Dashboard ✅
- [x] Quick Capture
- [x] Overdue tasks (🔥)
- [x] Today (🔴)
- [x] Next 7 Days (📅)
- [x] All Tasks (No Deadline) (📝) - NEW!
- [x] Top Focus (⭐)
- [x] Recent Projects

### Projects ✅
- [x] Create project
- [x] Project list
- [x] Knowledge tab (SOP, Policy, Workflow, Checklist, Guideline, Meeting Notes, Document)
- [x] Tasks tab

### Search ✅
- [x] Real-time full-text search
- [x] Find tasks and knowledge

### Settings ✅
- [x] Theme toggle
- [x] Data export

---

## Database Schema

### Projects
- id, name, description, status, timestamps

### Tasks
- id, projectId, title, description, importance, status, deadline, completed, timestamps

### Knowledge
- id, projectId, title, type, content, tags, timestamps

---

## Useful Commands

```bash
# Development
npm run dev              # Start local server
npm run build           # Build production
npm run start           # Run production build locally

# Database
npm run db:push         # Create/migrate tables
npm run db:seed         # Load sample data (3 projects, 7 tasks, 4 knowledge items)
npm run db:studio       # Open database GUI

# Git
git status              # Check changes
git add .               # Stage all
git commit -m "msg"     # Commit
git push                # Push to GitHub (auto-deploy to Vercel)
```

---

## Timeline Colors

| Color | Meaning | Example |
|-------|---------|---------|
| 🔥 Overdue | Task deadline passed | Due 22 July (today is 23 July) |
| 🔴 Today | Due today | Due 23 July |
| 🟠 1-2 Days | Due soon | Due 24-25 July |
| 🟡 3-7 Days | Next week | Due 26-30 July |
| 🟢 7+ Days | Future | Due 31 July+ |
| 📝 No Deadline | No deadline set | Any task without deadline |

---

## Task Importance

| Level | Usage |
|-------|-------|
| high | Top priority (Max 3 shown in Top Focus) |
| medium | Normal task |
| low | Nice to have |

---

## Common Issues

### "Port 3000 already in use"
```bash
# Already handled in launch.json (autoPort: true)
# Server will use different port automatically
```

### "Database connection error"
```bash
# Check DATABASE_URL in Vercel Settings
# Format should be: postgresql://user:password@host:5432/database
```

### "Build failed"
```bash
npm run build
# Fix errors
git push  # Vercel auto-redeploys
```

---

## Collaboration (if working with ChatGPT)

### Setup Git Branches
```bash
# Your work
git checkout -b claude-dev
# Make changes
git add .
git commit -m "message"
git push -u origin claude-dev

# Merge to main
git checkout main
git merge claude-dev
git push
```

Vercel auto-deploys on push to main!

---

## Folder Structure

```
gia-cac/
├── app/              # Next.js pages & API
├── components/       # React components
├── lib/             # Utilities
├── types/           # TypeScript types
├── prisma/          # Database
├── README.md        # Full documentation
├── SETUP.md         # Detailed setup
├── DEPLOY.md        # Deployment guide
└── IMPLEMENTATION.md # Technical details
```

---

## Next Steps

1. ✅ Run `npm run dev`
2. ✅ Deploy to Vercel + Supabase
3. ✅ Share URL with team
4. ⬜ Add Phase 2 features (calendar, kanban, etc.)
5. ⬜ Setup backups

---

## Support

- **Local dev issues**: See SETUP.md
- **Deployment issues**: See DEPLOY.md
- **Architecture questions**: See IMPLEMENTATION.md
- **Feature requests**: Modify code and push to GitHub (auto-deploy)

---

## Status

- ✅ MVP Complete
- ✅ All Phase 1 features working
- ✅ Production-ready
- ✅ Ready for Phase 2 expansion

**Happy building!** 🚀
