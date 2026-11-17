# Blog Project Server

The backend REST API server for the Blog application, built with Node.js, Express, PostgreSQL, and Prisma ORM. It provides secure user authentication, token rotation, post CRUD operations, input validation, and ownership authorization.

---

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM 7](https://www.prisma.io/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) (Local strategy and JWT strategy)
- **Security**:
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for access tokens
  - `cookie-parser` for httpOnly, secure refresh token cookies
  - Custom CSRF guard checking `X-Requested-With` headers
  - [cors](https://github.com/expressjs/cors) with configurable origin validation
- **Validation**: [express-validator](https://express-validator.github.io/docs/)
- **Slug Generation**: [nanoid](https://github.com/ai/nanoid) with `nanoid-dictionary`
- **Markdown Utilities**: `remark` and `strip-markdown`

---

## Features Built

### 1. Authentication & Session Security

- **Registration (`POST /api/register`)**: Creates new user records with salted bcrypt password hashing and input sanitation.
- **Login (`POST /api/login`)**: Authenticates credentials using Passport Local strategy, issues a short-lived JWT access token in response, and sets a cryptographically secure refresh token in an `httpOnly` cookie.
- **Refresh Token Rotation (`POST /api/token-refresh`)**: Implements strict refresh token rotation with token family tracking. If an expired or already-used token is reused outside the grace period, the entire token family is revoked to prevent replay attacks.
- **Logout (`POST /api/logout`)**: Revokes the current token family in the database and clears the refresh token cookie.
- **CSRF Mitigation**: Enforces custom header validation (`X-Requested-With`) across all state-changing API endpoints.
- **Client IP Logging**: Middleware for logging client IP addresses safely across reverse proxies.

### 2. Post Management & CRUD

- **Cursor Pagination (`GET /api/posts`)**: Returns a paginated list of published posts sorted by creation date with `nextCursor` for infinite scroll feeds.
- **Public Post View (`GET /api/posts/:slug`)**: Fetches single post by slug, returning sanitized author details (excluding sensitive credentials).
- **Post Creation (`POST /api/posts`)**: Authenticated endpoint that generates URL-safe slugs with collision resistance and enforces validation limits on title, subtitle, and markdown content.
- **Author Guarded Retrieval (`GET /api/posts/:slug/edit` & `GET /api/posts/:slug/manage`)**: Protected endpoints verified by `postOwnershipGuard` ensuring only the post author can view management/edit data.
- **Post Updates (`PATCH /api/posts/:slug`)**: Allows authors to update post title, subtitle, and content, recalculating slugs if the title changed.
- **Post Deletion (`DELETE /api/posts/:slug`)**: Author-guarded endpoint for permanently deleting posts.

### 3. Monitoring & Resilience

- **Health Check (`GET /api/health-check`)**: Status endpoint verifying API uptime and server readiness.
- **Centralized Error Handling**: Express error-handling middleware that catches operational failures and shields stack traces in production.

---

## Further Builds / Roadmap

- [ ] **Post Drafts & Publishing State**:
  - Expose API endpoints to toggle a post between `published: true` and `published: false` (draft).
  - Add author-only endpoint `GET /api/posts/drafts` to list personal draft posts.
  - Support auto-saving drafts during editing sessions.
- [ ] **Comments & Reactions**:
  - Add `Comment` model to Prisma schema (relation to `Post` and `User`).
  - Create `POST /api/posts/:slug/comments`, `GET /api/posts/:slug/comments`, and `DELETE /api/comments/:id`.
  - Add `Reaction` model supporting likes and emoji reactions with counter aggregations.
- [ ] **User Dashboard & Analytics**:
  - Dedicated author dashboard endpoints (e.g., `GET /api/user/dashboard`) aggregating total views, post counts, and publication history.
  - Analytics data tracking per post.
- [ ] **User Profile & Theme Preferences**:
  - Author profile endpoints (`GET /api/user/profile`, `PATCH /api/user/profile`) for updating pen names and bios.
  - Store user theme preferences (light, dark, system) in user settings for cross-device persistence.

---

## Database Schema (Prisma)

The application uses PostgreSQL with the following core models:

- **`User`**: Author accounts (`id`, `email`, `password`, `createdAt`, `updatedAt`).
- **`RefreshToken`**: Session management (`id`, `tokenHash`, `familyId`, `isRevoked`, `userId`, `graceExpiresAt`, `expiresAt`).
- **`Post`**: Blog posts (`id`, `title`, `subtitle`, `slug`, `content`, `published`, `authorId`, `createdAt`, `updatedAt`).

---

## API Endpoints Reference

### Health

| Method | Endpoint            | Access | Description                           |
| ------ | ------------------- | ------ | ------------------------------------- |
| `GET`  | `/api/health-check` | Public | Server uptime and health verification |

### Authentication

| Method | Endpoint             | Access | Description                                       |
| ------ | -------------------- | ------ | ------------------------------------------------- |
| `POST` | `/api/register`      | Public | Register new user account                         |
| `POST` | `/api/login`         | Public | Authenticate user, return JWT, set refresh cookie |
| `POST` | `/api/token-refresh` | Public | Rotate refresh token and issue new JWT            |
| `POST` | `/api/logout`        | Public | Revoke token family and clear cookie              |

### Posts

| Method   | Endpoint                  | Access        | Description                                  |
| -------- | ------------------------- | ------------- | -------------------------------------------- |
| `GET`    | `/api/posts`              | Public        | Get cursor-paginated list of published posts |
| `POST`   | `/api/posts`              | Authenticated | Create a new post                            |
| `GET`    | `/api/posts/:slug`        | Public        | View a published post by slug                |
| `GET`    | `/api/posts/:slug/edit`   | Author Only   | Get post data for editing                    |
| `GET`    | `/api/posts/:slug/manage` | Author Only   | Get post data for management dashboard       |
| `PATCH`  | `/api/posts/:slug`        | Author Only   | Update post title, subtitle, or content      |
| `DELETE` | `/api/posts/:slug`        | Author Only   | Delete a post                                |

---

## Project Structure

```text
server/
├── config/                  # Passport strategies and environment loader
├── controller/              # Route controllers (post, auth, health check)
├── db/                      # Prisma client instance and database query modules
│   └── scripts/             # Database seed scripts
├── middleware/              # Auth guards, ownership guards, CSRF check, IP logging
├── prisma/                  # Prisma schema and migrations
├── routes/                  # Express route definitions
├── validator/               # Express-validator validation rules and handlers
├── app.js                   # Express application setup and middleware
├── server.js                # Server entry point (starts HTTP listener)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database instance

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/blog_db?schema=public
JWT_SECRET_KEY=your_jwt_secret_key_here
```

### Installation & Database Setup

From the monorepo root:

```bash
# Install dependencies
npm install

# Run Prisma migrations
cd server
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# (Optional) Seed the database with sample posts and users
node db/scripts/seed.js
```

### Running the Server

```bash
# Start development server with nodemon
npm run dev --workspace=server

# Start production server
npm start --workspace=server
```

The server will be available at `http://localhost:3000`.
