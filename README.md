
---

# 6) Local Setup (macOS M1)

## 6.1 Prereqs
- Node 20+ (`node -v`)
- PNPM or NPM (I used npm commands above)
- MongoDB Atlas account (free tier)
- Clerk account (free tier)

## 6.2 Environment

1) **Create MongoDB Atlas cluster**, get connection string → fill `backend/.env`.

2) **Create Clerk app**  
   - Enable Email/Password or OTP as you like  
   - Get **Publishable Key** + **JWT public key (PEM)**  
   - Add `http://localhost:3000` to allowed origins.  
   - Put **PEM** into `backend/.env` `CLERK_PEM_PUBLIC_KEY` (keep line breaks as `\n`).

3) **Frontend env**: copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_API_BASE=http://localhost:8080`
   - `NEXT_PUBLIC_APP_BASE=http://localhost:3000`

4) **Install & run**
```bash
# backend
cd backend
cp .env.example .env
npm i
npm run dev

# frontend
cd ../frontend
cp .env.local.example .env.local
npm i
npm run build
npm run export
# For local static preview:
npx serve out -l 3000
# (or: npm i -D serve)
