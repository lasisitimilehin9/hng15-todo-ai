# HNG15 Todo AI

Simple To-Do List application built for **HNG Internship 15 – Stage 1**.

Built entirely with AI coding assistance (Grok).

## Features

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as complete / incomplete
- Notes on every task
- Priority levels: Low · Medium · High
- Automated API tests
- Clean, mobile-friendly UI

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Framework    | Next.js 15 (App Router)     |
| Language     | TypeScript                  |
| Styling      | Tailwind CSS 3              |
| Database     | PostgreSQL via Prisma       |
| Tests        | Vitest                      |
| Deployment   | Vercel                      |

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd hng15-todo-ai
npm install
```

### 2. Environment variables

Copy the example file and set your database URL:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
```

Free options: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Vercel Postgres](https://vercel.com/storage/postgres).

### 3. Database setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Run tests

```bash
npm test
```

## API Endpoints

| Method | Path              | Description          |
|--------|-------------------|----------------------|
| GET    | `/api/tasks`      | List all tasks       |
| POST   | `/api/tasks`      | Create a task        |
| GET    | `/api/tasks/[id]` | Get one task         |
| PUT    | `/api/tasks/[id]` | Update a task        |
| DELETE | `/api/tasks/[id]` | Delete a task        |

### Example create body

```json
{
  "title": "Buy milk",
  "notes": "2 litres, full cream",
  "priority": "HIGH"
}
```

## Project Structure

```
app/
  api/tasks/          API routes
  layout.tsx
  page.tsx
  globals.css
components/           UI components
lib/prisma.ts         Prisma client
prisma/schema.prisma  Database schema
tests/api/            Automated tests
AGENTS.md             AI coding rules
```

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variable `DATABASE_URL` (production Postgres URL).
4. Deploy. The `postinstall` script will run `prisma generate`.

After the first deploy you may need to run `npx prisma db push` against the production database (or use Prisma Migrate).

## Manual Test Checklist

- [ ] Create a task with title only
- [ ] Create a task with title + notes + priority
- [ ] Edit title, notes and priority
- [ ] Mark task complete / incomplete
- [ ] Delete a task
- [ ] Empty state appears when no tasks exist
- [ ] Page refresh keeps the data (persistence)
- [ ] Invalid title is rejected by the API

## License

MIT
HNG 15 Stage 1
