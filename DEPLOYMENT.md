# 🔤 Morse Code App — สรุปโค้ดและคำแนะนำการ Deploy

## สรุปโครงสร้างโปรเจค

โปรเจคนี้เป็น **Full-stack Morse Code Learning App** แบ่งเป็น 2 ส่วน:

```
morsecode-main/
├── client/          ← Frontend (Next.js)
└── server/          ← Backend API (Express.js + Prisma + PostgreSQL)
```

---

## 🖥️ Backend (server/) — สิ่งที่คุณต้อง Deploy

### Tech Stack
| เทคโนโลยี | หน้าที่ |
|---|---|
| **Express.js** | Web framework รับ HTTP requests |
| **Prisma ORM** | จัดการ database ผ่าน schema |
| **PostgreSQL** | ฐานข้อมูลหลัก |
| **JWT** | ระบบ authentication (token หมดอายุ 7 วัน) |
| **bcryptjs** | hash password ก่อนเก็บลง database |

### Database Models (4 ตาราง)

```mermaid
erDiagram
    User ||--o| Settings : "has one"
    User ||--o{ Result : "has many"
    User {
        int id PK
        string email UK
        string username UK
        string password
    }
    Settings {
        int id PK
        int userId FK
        string theme
        int soundVolume
        boolean showHints
        string preferredMode
    }
    Result {
        int id PK
        int userId FK
        string mode
        string letterMode
        int letterCount
        float accuracy
        float wpm
        int timeTaken
    }
    Word {
        int id PK
        string word UK
        string difficulty
    }
```

### API Endpoints

| Method | Endpoint | Auth? | หน้าที่ |
|---|---|---|---|
| GET | `/api/health` | ❌ | Health check |
| POST | `/api/auth/register` | ❌ | สมัครสมาชิก |
| POST | `/api/auth/login` | ❌ | เข้าสู่ระบบ |
| GET | `/api/auth/me` | ✅ | ดูข้อมูล user ปัจจุบัน |
| GET | `/api/results` | ✅ | ดูผลลัพธ์ทั้งหมด |
| POST | `/api/results` | ✅ | บันทึกผลลัพธ์ใหม่ |
| GET | `/api/results/stats` | ✅ | ดูสถิติรวม |
| GET | `/api/results/stats/detailed` | ✅ | ดูสถิติแยกตามโหมด |
| DELETE | `/api/results/:id` | ✅ | ลบผลลัพธ์ |
| GET | `/api/settings` | ✅ | ดู settings |
| PUT | `/api/settings` | ✅ | แก้ไข settings |
| GET | `/api/random/letters` | ❌ | สุ่มตัวอักษร |
| GET | `/api/random/words` | ❌ | สุ่มคำศัพท์ |
| POST | `/api/random/words/seed` | ❌ | Seed คำศัพท์ลง DB |
| GET | `/api/random/words/list` | ❌ | แสดงคำศัพท์ทั้งหมด |

### Environment Variables ที่ต้องตั้ง

```
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key-here"
PORT=3001
```

---

## 🚀 แนะนำ Platform สำหรับ Deploy

### ⭐ ตัวเลือกที่ 1: **Railway** (แนะนำมากที่สุด)

> [!TIP]
> Railway เหมาะที่สุดเพราะ deploy ได้ทั้ง Backend + PostgreSQL ในที่เดียว, UI ง่าย, มี Free Trial $5

**ข้อดี:**
- มี PostgreSQL built-in (ไม่ต้องแยกไปหา database)
- Deploy จาก GitHub ได้เลย, push code แล้ว auto-deploy
- ตั้ง Environment Variables ผ่าน UI
- มี Free Trial $5 (พอใช้ได้หลายเดือนถ้าโหลดไม่เยอะ)

**ขั้นตอน:**
1. สร้างบัญชีที่ [railway.app](https://railway.app)
2. Push โค้ดขึ้น GitHub (ถ้ายังไม่ได้ push)
3. สร้าง Project ใหม่ → เลือก "Deploy from GitHub Repo"
4. เลือก repo แล้วชี้ root directory เป็น `server/`
5. Railway จะเพิ่ม PostgreSQL ให้ → กด "Add Service" → "Database" → "PostgreSQL"
6. Railway จะสร้าง `DATABASE_URL` ให้อัตโนมัติ
7. ตั้ง Environment Variables เพิ่มเติม:
   - `JWT_SECRET` = ค่าลับที่คุณตั้งเอง (ใช้ `openssl rand -hex 32` สร้างได้)
8. รอ deploy เสร็จ → ได้ URL เช่น `https://morsecode-server-production.up.railway.app`
9. รัน DB migration: ใช้ Railway CLI หรือไปที่ Settings → Run Command: `npx prisma migrate deploy`
10. Seed คำศัพท์: `POST https://your-url/api/random/words/seed`

---

### ตัวเลือกที่ 2: **Render**

**ข้อดี:**
- มี Free tier (แต่จะ spin down หลัง 15 นาทีไม่มีคนใช้)
- มี PostgreSQL ฟรี (จำกัด 90 วัน)
- Deploy จาก GitHub ได้

**ข้อเสีย:**
- Free tier จะ cold start ช้า (~30 วินาที)
- PostgreSQL ฟรีหมดอายุ 90 วัน

**ขั้นตอน:**
1. สร้างบัญชีที่ [render.com](https://render.com)
2. สร้าง PostgreSQL database ก่อน → คัด connection string
3. สร้าง Web Service → เชื่อม GitHub → Root Directory = `server/`
4. ตั้ง Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
5. ตั้ง Start Command: `npm start`
6. ตั้ง Environment Variables: `DATABASE_URL`, `JWT_SECRET`

---

### ตัวเลือกที่ 3: **Supabase (DB) + Vercel/Railway (Backend)**

**เหมาะถ้า:** อยากได้ PostgreSQL ฟรีถาวร (Supabase มี free tier ไม่หมดอายุ)

**ขั้นตอน:**
1. สร้าง database ที่ [supabase.com](https://supabase.com) → คัด connection string
2. Deploy backend ขึ้น Railway หรือ Render ตามด้านบน
3. ใช้ connection string ของ Supabase เป็น `DATABASE_URL`

---

## 📋 สรุปขั้นตอน Deploy ที่ต้องทำ (ไม่ว่าจะเลือก platform ไหน)

```mermaid
flowchart TD
    A["1. Push โค้ดขึ้น GitHub"] --> B["2. สร้าง PostgreSQL Database"]
    B --> C["3. Deploy Backend"]
    C --> D["4. ตั้ง Environment Variables"]
    D --> E["5. รัน Prisma Migration"]
    E --> F["6. Seed คำศัพท์"]
    F --> G["7. ทดสอบ API"]
    
    style A fill:#1e293b,stroke:#3b82f6,color:#fff
    style B fill:#1e293b,stroke:#8b5cf6,color:#fff
    style C fill:#1e293b,stroke:#3b82f6,color:#fff
    style D fill:#1e293b,stroke:#f59e0b,color:#fff
    style E fill:#1e293b,stroke:#8b5cf6,color:#fff
    style F fill:#1e293b,stroke:#8b5cf6,color:#fff
    style G fill:#1e293b,stroke:#22c55e,color:#fff
```

### Step-by-Step (ใช้ Railway เป็นตัวอย่าง):

#### 1️⃣ Push โค้ดขึ้น GitHub

```powershell
# ถ้ายังไม่มี git repo
cd c:\Users\Lenovo\Downloads\morsecode-main\morsecode-main
git init
git add .
git commit -m "initial commit"
# สร้าง repo ใหม่บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/morsecode.git
git push -u origin main
```

#### 2️⃣ เข้า Railway → สร้าง Project

1. ไปที่ [railway.app](https://railway.app) → Login ด้วย GitHub
2. กด **"New Project"** → **"Deploy from GitHub Repo"**
3. เลือก repo `morsecode`
4. **สำคัญ:** ตั้ง Root Directory เป็น `server` (เพราะ backend อยู่ใน subfolder)

#### 3️⃣ เพิ่ม PostgreSQL

1. ใน Project → กด **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway จะสร้าง DB และตั้ง `DATABASE_URL` ให้อัตโนมัติ

#### 4️⃣ ตั้ง Environment Variables

ไปที่ Backend Service → Tab **"Variables"** → เพิ่ม:
- `JWT_SECRET` = สร้างค่าลับ (เช่น `mysupersecretkey123456`)
- `PORT` = `3001` (หรือใช้ `${{PORT}}` ที่ Railway ให้)

#### 5️⃣ ตั้ง Build & Start Commands

ไปที่ **Settings** ของ Service:
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `npm start`

### 6️⃣ Deploy & ทดสอบ (สำเร็จแล้ว ✅)

**Public URL ของคุณ:** `https://morsecode-production.up.railway.app`

**Settings ที่ใช้จริง:**
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npx prisma db push --accept-data-loss && npm start`
- **Variables:** `DATABASE_URL`, `JWT_SECRET`, `PORT`

**Endpoints ทดสอบ:**
- Health Check: `https://morsecode-production.up.railway.app/api/health`
- Seed Data: `POST https://morsecode-production.up.railway.app/api/random/words/seed`
- Register: `POST https://morsecode-production.up.railway.app/api/auth/register`

> [!IMPORTANT]
> นำ URL นี้ไปใช้ใน Frontend (ไฟล์ `.env` หรือ `config.js` ของฝั่งหน้าบ้าน) ได้เลยครับ แทนที่ `localhost:3001`

---

## 💰 เปรียบเทียบค่าใช้จ่าย

| Platform | DB | Backend | Free Tier | หมายเหตุ |
|---|---|---|---|---|
| **Railway** | ✅ Built-in | ✅ | $5 trial credit | แนะนำ, ง่ายที่สุด |
| **Render** | ✅ Built-in | ✅ | มี (แต่จำกัด) | DB ฟรี 90 วัน, cold start ช้า |
| **Supabase + Railway** | Supabase (free) | Railway ($5) | DB ฟรีถาวร | เหมาะถ้าอยาก DB ฟรีนานๆ |
| **Supabase + Render** | Supabase (free) | Render (free) | ฟรีทั้งคู่ | ประหยัดสุด แต่ช้า (cold start) |

> [!IMPORTANT]
> หลัง deploy เสร็จ อย่าลืมอัปเดต client (Next.js) ให้ชี้ API URL ไปที่ URL ใหม่ที่ได้จาก deployment แทน `localhost:3001`
