# Blog Project

A modern full-stack blogging platform built with a decoupled monorepo architecture featuring a React + Vite client and an Express + Prisma backend.

---

## Workspace Packages

- **[Client](./client/README.md)**: Frontend application built with React 19, Vite, Tailwind CSS v4, and shadcn/ui. Includes TipTap rich text markdown editing, cursor pagination, and responsive layouts.
- **[Server](./server/README.md)**: Backend REST API built with Node.js, Express, PostgreSQL, and Prisma ORM. Features Passport.js authentication (Local & JWT), refresh token rotation, and post CRUD operations.

For project change history and roadmap milestones, see **[CHANGELOG.md](./CHANGELOG.md)**.

---

## Features Built

- **Full-Stack Authentication**: User registration, login, logout, and token rotation with httpOnly cookies and cross-tab session synchronization.
- **Rich Text Markdown Publishing**: TipTap editor with markdown formatting, live word and character counters, and syntax-highlighted code rendering.
- **Post CRUD & Management**: Complete create, read, update, and delete workflow with slug generation, author ownership guards, and post management dashboards.
- **Infinite Scroll Feed**: Fast cursor-based pagination with intersection observer prefetching.
- **Resilience & UX**: Custom error pages (404, 5xx server offline), top progress indicators, flash toast notifications, and PWA manifest integration.

---

## Further Builds / Roadmap

- **Post Drafts & Publishing**: Draft creation, auto-saving, and toggleable publication states.
- **Comments & Reactions**: Threaded post comments and emoji reactions with real-time counters.
- **User Dashboard**: Centralized author hub for post metrics, analytics, and personal drafts.
- **Theme Switcher**: Dark mode, light mode, and system preference options via `next-themes`.

---

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL database instance

### Setup

```bash
# Clone the repository
git clone https://github.com/TonyFred-code/blog-project.git
cd blog-project

# Install all workspace dependencies
npm install

# Setup server environment variables
cp server/.env.example server/.env # or configure server/.env

# Run database migrations and generate Prisma client
cd server
npx prisma migrate dev
npx prisma generate
cd ..

# Start both client and server concurrently
npm run dev
```

The client will be running at `http://localhost:5173` and the API server at `http://localhost:3000`.

---

## License

This project is licensed under the [MIT License](./LICENSE).
