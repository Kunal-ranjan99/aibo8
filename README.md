# Aibo8 — AI, Robotics & IoT Learning Management System

A modern, dark-futuristic Learning Management System built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Prisma + PostgreSQL**.

## Features Included
- **Dark Futuristic AI & Robotics Homepage** with custom 3D hardware visuals, specialization tracks, and filterable course tabs.
- **Course Marketplace (`/courses`)** with live search, track/level/price filtering, and sorting.
- **Course Detail & Enrollment (`/courses/[slug]`)** with curriculum overview, coupon codes (`AIBO20`, `ROBOTICS50`, `LAUNCH100`), and Free/Demo Checkout.
- **Interactive Course Player (`/learn/[slug]`)** supporting Video lessons, Copyable Code Labs, Architecture Articles, Interactive Quizzes with instant grading, Personal Lab Notes, Progress Tracking, and Automatic Verified Certificates (`/certificates/[id]`).
- **Role-Based Portals**:
  - **Student Dashboard** (`/dashboard/student`)
  - **Instructor Studio** (`/dashboard/instructor`) — create & submit new courses
  - **Admin Control Panel** (`/dashboard/admin`) — approve courses, manage roles, create coupons

## Demo Credentials (1-Click on `/auth/login`)
- **Student:** `student@aibo8.ai` / `student123`
- **Instructor:** `elena@aibo8.ai` / `instructor123`
- **Admin:** `admin@aibo8.ai` / `admin123`

## Run Locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Vercel Today
1. Push this folder to a GitHub repository (or run `npx vercel`).
2. In Vercel, optionally attach a **Neon** or **Supabase** PostgreSQL database and set `DATABASE_URL` + `JWT_SECRET` in Environment Variables.
   - Even without `DATABASE_URL`, Aibo8 boots immediately in zero-config Demo Mode!
   - With `DATABASE_URL`, run `npx prisma db push && npm run db:seed` to initialize tables and seed courses.
