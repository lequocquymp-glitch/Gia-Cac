# Gia Các Command Center - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

**Option A: SQLite (Recommended for development)**
```bash
# Already configured in .env.local
npm run db:push
npm run db:seed
```

**Option B: PostgreSQL (Supabase or Self-hosted)**

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/gia-cac"
```

3. Run:
```bash
npm run db:push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### View Data in Studio
```bash
npm run db:studio
```

### Seed Data
```bash
npm run db:seed
```

### Reset Database
```bash
npx prisma migrate reset
```

## Project Structure

```
gia-cac/
├── app/                    # Next.js app router
│   ├── (app)/             # Layout group with sidebar
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Sidebar, main layout
│   ├── home/             # Home dashboard components
│   └── projects/         # Project detail components
├── lib/                   # Utilities
│   ├── prisma.ts        # Prisma client
│   └── timeline.ts      # Date/timeline logic
├── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── .env.local           # Environment variables
```

## Features

### Home Dashboard
- **Quick Capture**: Add tasks in seconds
- **Overdue/Today/Next 7 Days**: Automatic categorization
- **Top Focus**: Top 3 high-importance tasks
- **Recent Projects**: Quick access to projects

### Projects
- Create and manage projects
- Two tabs: Knowledge (docs) and Tasks
- Different knowledge types: SOP, Policy, Workflow, etc.

### Search
- Full-text search across tasks and knowledge
- Realtime results

### Settings
- Theme toggle
- Data backup/export

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **UI**: TailwindCSS + shadcn/ui components + Lucide icons
- **State**: Zustand
- **Language**: TypeScript

## Key Decisions

1. **SQLite for dev**: No database setup needed
2. **Server Components**: Fast initial load, less JavaScript
3. **Revalidate 0**: Real-time data updates
4. **Simple 3-entity schema**: Projects, Tasks, Knowledge
5. **No over-engineering**: MVP focus

## Deployment

### Vercel (Recommended)
```bash
git push
```

### Railway / Render
1. Connect database
2. Set `DATABASE_URL` environment variable
3. Deploy

## Next Steps (Phase 2)

- [ ] Calendar view
- [ ] Kanban board
- [ ] Gantt chart
- [ ] Email notifications
- [ ] Recurring tasks
- [ ] Team collaboration
- [ ] File attachments
- [ ] Activity history
