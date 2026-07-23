# Deploy Gia Các Command Center to Production

Hướng dẫn deploy lên **Vercel + Supabase** (miễn phí, chạy 24/7, dữ liệu persistent).

## Prerequisites

- GitHub account (free)
- Vercel account (free, auto-login với GitHub)
- Supabase account (free)

---

## Step 1: Setup Supabase Database (5 minutes)

### 1.1 Tạo Supabase Project

1. Tới https://supabase.com
2. Click **"Start your project"**
3. Login với email: `lequocquy.mp@gmail.com`
4. Click **"New Project"**
5. Điền:
   - **Project name**: `gia-cac`
   - **Database password**: Tự đặt mật khẩu (lưu lại!)
   - **Region**: Chọn gần nhất (Singapore hoặc Tokyo)
6. Click **"Create new project"**
7. Chờ ~ 2 phút database được tạo

### 1.2 Lấy Connection String

1. Tại trang project Supabase
2. Click **"Connect"** (nút xanh top-right)
3. Copy connection string (dạng: `postgresql://...`)
4. Lưu vào notepad, cần dùng sau

---

## Step 2: Push Code to GitHub (5 minutes)

### 2.1 Tạo GitHub Repository

1. Tới https://github.com/new
2. **Repository name**: `gia-cac`
3. **Description**: `Personal project management system`
4. **Public** hoặc **Private** (tuỳ bạn)
5. Click **"Create repository"**

### 2.2 Push Local Code

Chạy lệnh này ở thư mục `gia-cac`:

```bash
cd D:\DBL-CU-Cowork\gia-cac

# Set remote
git remote add origin https://github.com/YOUR_USERNAME/gia-cac.git

# Rename branch to main (GitHub mặc định)
git branch -M main

# Push
git push -u origin main
```

✅ Code hiện trên GitHub!

---

## Step 3: Setup Environment Variables (2 minutes)

### 3.1 Update .env.production

Tạo file `.env.production` (hoặc sửa `.env.local`):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
```

Replace:
- `YOUR_PASSWORD` = password từ Supabase (step 1.1)
- `YOUR_PROJECT` = project name (gia-cac)

### 3.2 Commit Changes

```bash
git add .env.production
git commit -m "Add production environment"
git push
```

---

## Step 4: Deploy to Vercel (3 minutes)

### 4.1 Connect GitHub to Vercel

1. Tới https://vercel.com/new
2. Login với GitHub (sẽ auto-authorize)
3. Chọn repository **gia-cac**
4. Click **"Import"**

### 4.2 Configure Project

**Build & Output Settings** - để mặc định (auto-detect Next.js)

**Environment Variables**:
- Name: `DATABASE_URL`
- Value: (dán connection string từ Supabase)
- Click **"Add"**

### 4.3 Deploy

Click **"Deploy"**

Chờ ~ 1-2 phút deployment hoàn thành.

✅ **App live!** Vercel sẽ cho URL như: `gia-cac.vercel.app`

---

## Step 5: Initialize Database on Production (3 minutes)

### 5.1 Run Database Migration

Sau khi Vercel deploy xong, bạn cần push schema lên Supabase:

```bash
# Set DATABASE_URL để Prisma dùng production database
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@db.gia-cac.supabase.co:5432/postgres"

# Push schema
npm run db:push

# Seed data
npm run db:seed
```

✅ Database setup xong!

---

## Step 6: Test Live Website

1. Mở link Vercel (ví dụ: `https://gia-cac.vercel.app`)
2. Thêm task
3. Tạo project
4. Thử search
5. Tắt máy, mở lại - dữ liệu vẫn còn ✅

---

## Troubleshooting

### Database Connection Error

**Lỗi**: "PrismaClientInitializationError"

**Cách fix**:
1. Check `DATABASE_URL` ở Vercel Settings → Environment Variables
2. Đảm bảo format: `postgresql://user:password@host:5432/postgres`
3. Re-deploy: Click **"Redeploy"** ở Vercel

### Build Failed

**Lỗi**: TypeScript error

**Cách fix**:
```bash
npm run build
# Fix errors locally
git push
# Vercel tự re-deploy
```

### Data Lost After Redeploy

- Không nên xảy ra (dữ liệu ở Supabase)
- Nếu xảy ra: Check connection string ở .env

---

## Auto-Deploy on Push

Vercel **tự động deploy** mỗi khi bạn push code lên GitHub!

```bash
# Fix bug / thêm feature
git add .
git commit -m "Fix timeline bug"
git push

# Vercel tự deploy trong 1-2 phút
```

---

## Database Backup

### Manual Backup

```bash
# Export data
npm run db:studio

# Download as JSON từ Supabase dashboard
```

### Auto-Backup (Supabase)

Supabase tự động backup mỗi tuần (free tier).

---

## Cost Analysis

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100 GB bandwidth/month | Free |
| Supabase | 500 MB database + 1 GB bandwidth | Free |
| **Total** | Đủ cho 10K+ tasks | **Free Forever** |

✅ Không tốn tiền!

---

## Next Steps

1. ✅ Deploy lên Vercel + Supabase
2. ✅ Share URL với team
3. ✅ Setup auto-backup
4. ✅ Monitor performance (Vercel dashboard)
5. ✅ Add Phase 2 features

---

## Useful Commands

```bash
# Local development
npm run dev

# Build production
npm run build
npm run start

# Database
npm run db:push       # Migrate
npm run db:seed       # Load sample data
npm run db:studio     # GUI

# Git
git push              # Auto-deploy to Vercel
git pull              # Sync từ team
```

---

## Live URL

Sau deploy, app sẽ chạy tại:

```
https://gia-cac.vercel.app
```

**Chia sẻ URL này để team dùng!**

---

## Team Collaboration

### Nếu ChatGPT cũng làm:

1. **Create branches** để tránh conflict
   ```bash
   git checkout -b claude-feature
   git checkout -b chatgpt-feature
   ```

2. **Merge về main** định kỳ
   ```bash
   git checkout main
   git merge claude-feature
   git push
   ```

3. **Vercel tự deploy** khi merge về main

---

## Questions?

Check:
- README.md - Features overview
- SETUP.md - Local development
- IMPLEMENTATION.md - Technical details
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
