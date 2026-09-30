# AGENTS.md – AI Coding Rules for hng15-todo-ai

This file tells any AI coding assistant exactly how to work on this project.

## Project Overview

- **Name**: hng15-todo-ai
- **Purpose**: HNG Internship 15 – Stage 1 To-Do List application
- **Built entirely with AI coding assistance**

## Tech Stack (do not change without strong reason)

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS 3
- Prisma ORM + PostgreSQL
- Vitest for API tests
- Deploy target: Vercel

## Core Features (must remain)

1. Create task
2. Edit task
3. Delete task
4. Mark task complete / incomplete
5. Notes on tasks
6. Priority (LOW | MEDIUM | HIGH)

Do **not** add:
- Authentication / multi-user
- Real-time (WebSockets, etc.)
- File uploads
- Payments
- Complex state libraries (Redux, Zustand, etc.)
- Unnecessary UI libraries

## Project Structure

```
app/
  api/tasks/          → API route handlers
  layout.tsx
  page.tsx            → Main UI (client component)
  globals.css
components/           → Reusable UI pieces
lib/prisma.ts         → Prisma client singleton
prisma/schema.prisma
tests/api/            → Automated API tests
```

## Coding Conventions

- Use TypeScript strictly. Prefer explicit types over `any`.
- API routes live under `app/api/.../route.ts`.
- Keep components small and focused.
- Client components that need interactivity must start with `"use client"`.
- Validation belongs in the API routes (title required, priority enum, etc.).
- Use the existing Prisma client from `@/lib/prisma`.
- Tailwind utility classes only – no custom CSS frameworks.
- Prefer simple `fetch` in the frontend over heavy data libraries.

## Database

- Provider: PostgreSQL (Prisma)
- Connection via `DATABASE_URL` environment variable
- Model: single `Task` with fields `id`, `title`, `notes`, `completed`, `priority`, `createdAt`, `updatedAt`
- After schema changes run: `npx prisma generate` and `npx prisma db push` (or migrate)

## Testing

- Automated tests live in `tests/api/`
- Run with `npm test`
- Tests mock Prisma so they can run without a live database
- Keep tests focused on API behaviour and validation

## Environment Variables

- `DATABASE_URL` – required (PostgreSQL connection string)

## What to avoid

- Do not introduce authentication.
- Do not change the database provider without updating this file and the README.
- Do not add new top-level features unless the user explicitly asks.
- Do not commit `.env` files.
- Do not hard-code secrets.

## Deployment notes

- Designed for Vercel
- `postinstall` script runs `prisma generate`
- Build command effectively runs `prisma generate && next build`
- Set `DATABASE_URL` in the Vercel project environment variables
