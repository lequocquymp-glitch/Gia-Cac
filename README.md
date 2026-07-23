# Gia Các Command Center - MVP

A lightweight, fast personal project management system built with Next.js, React, and SQLite.

## 🎯 Features

### Home Dashboard (90% of usage)
- **Quick Capture**: Add tasks in seconds with Enter key
- **Overdue/Today/Next 7 Days**: Automatic timeline categorization with emoji badges
- **Top Focus**: Max 3 high-importance tasks for focus
- **Recent Projects**: Quick access to your projects

### Projects
- Create and manage projects
- **Two Tabs**:
  - **Knowledge**: Store SOPs, policies, workflows, checklists, guidelines, meeting notes, documents
  - **Tasks**: Manage project-specific tasks

### Search
- Full-text search across tasks and knowledge
- Real-time results
- Find by title, description, or content

### Settings
- Theme toggle (Light/Dark)
- Data export (JSON backup)
- Notification preferences

## 📊 Tech Stack

- **Framework**: Next.js 16 + React 19
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma 6
- **UI**: TailwindCSS + Lucide React icons
- **Language**: TypeScript
- **State**: Zustand (minimal, only UI state)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
cd gia-cac

npm install

npm run db:push

npm run db:seed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gia-cac/
├── app/                   # Next.js App Router
│   ├── (app)/            # Route group with sidebar
│   │   ├── page.tsx      # Home dashboard
│   │   ├── projects/     # Projects pages
│   │   ├── search/       # Search page
│   │   └── settings/     # Settings page
│   ├── api/              # REST API
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utilities
├── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed script
└── public/             # Static assets
```

## 🗄️ Database Schema

**3 simple entities** - no over-engineering:
- **Projects**: id, name, description, status, timestamps
- **Tasks**: id, projectId, title, description, importance, status, deadline, completed, timestamps
- **Knowledge**: id, projectId, title, type, content, tags, timestamps

## 📋 Task Status
- `todo` - Not started
- `doing` - In progress
- `waiting` - Blocked
- `done` - Completed

## 🎨 Importance
- `high` - Priority
- `medium` - Normal
- `low` - Nice to have

## 🌈 Timeline Colors
- 🔥 Overdue
- 🔴 Today
- 🟠 1-2 Days
- 🟡 3-7 Days
- 🟢 7+ Days

## 🔧 Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production server
npm run db:push      # Initialize database
npm run db:seed      # Load sample data
npm run db:studio    # Open database GUI
```

## 📈 Performance

- Load time < 1s
- Indexed database queries
- Server-side rendering
- Minimal JavaScript

## 🚢 Deployment

### Vercel
```bash
git push
# Vercel auto-deploys
# Set DATABASE_URL environment variable
```

### Other Platforms
Set up PostgreSQL database and `DATABASE_URL` environment variable.

## 🔮 Phase 2 (Roadmap)

- Calendar view
- Kanban board
- Gantt chart
- Email notifications
- Recurring tasks
- Team collaboration
- File attachments
- Activity history

## ❓ More Info

See `SETUP.md` for detailed setup instructions.
