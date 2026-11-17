# Changelog

All notable changes to the Blog Application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- **Post Drafts & Publishing Workflow**:
  - Auto-saving drafts and draft state persistence.
  - Publish / unpublish toggle controls with visual status badges.
  - Draft preview mode for authors prior to publishing.
- **Comments & Reactions**:
  - Post comment section with nested/threaded replies.
  - Likes and emoji reactions with real-time counters.
  - Comment moderation capabilities for post authors.
- **User Dashboard**:
  - Dedicated author dashboard to manage all published posts and drafts in one place.
  - Post performance metrics (views, read counts, engagement stats).
  - Profile customization and author bio settings.
- **Theme Support**:
  - Dark mode, light mode, and system preference switcher using `next-themes`.
  - Header theme toggle dropdown / button.

---

## [1.0.0] - 2026-11-17

### Added

- **Post Management & CRUD Operations**:
  - Create posts with a rich text markdown editor powered by TipTap and `@editorcn/editor`.
  - Multi-stage post creation and edit flows (Title, Content, and Preview) with real-time character and word count statistics.
  - Automatic URL slug generation with collision resistance using nanoid dictionaries.
  - Public post view page with sanitized Markdown rendering, GitHub Flavored Markdown (GFM), and syntax-highlighted code blocks (`lowlight`).
  - Post edit page with author ownership verification and form hydration.
  - Post management page (`/post/:slug/manage`) featuring tabbed navigation (Overview, Analytics, Reports, Settings).
  - Safe post deletion with a confirmation prompt within a shadcn alert dialog.
- **Feed & Pagination**:
  - Home feed featuring cursor-based pagination and sentinel intersection prefetching.
  - Database queries that filter for published posts in the public feed.
- **Authentication & Security**:
  - User registration and login utilizing Passport.js local and JWT strategies.
  - Secure password hashing using bcrypt.
  - Short-lived JWT access tokens stored in memory and refresh tokens stored in httpOnly, secure cookies.
  - Refresh token rotation with token family tracking, revocation on token reuse, and grace expiration windows.
  - Multi-tab authentication state synchronization via the `BroadcastChannel` API.
  - CSRF mitigation enforcing the custom `X-Requested-With` header on API requests.
  - Route guards: `ProtectedRoute` for authenticated views and `RestrictAuth` for guest-only pages.
  - Post ownership middleware (`postOwnershipGuard`) restricting edits and deletions to author.
- **User Interface & Design System**:
  - Modern interface styled with Tailwind CSS v4 and shadcn/ui components (base-nova with Zinc palette).
  - Space Grotesk variable typography.
  - Top loading progress bar (`TopLoader`) using NProgress for route transitions.
  - Toast notification system with Sonner for actionable feedback (login, logout, flash messages).
  - Responsive header with user avatars (Dicebear) and profile dropdown menu.
  - Automatic scroll restoration on page navigation (`ScrollToTop`).
- **Error Handling & UX Polish**:
  - Custom `ErrorPage` providing contextual feedback for 404 (Not Found), 5xx server errors, and network disconnects with retry actions.
  - Route loaders configured to throw responses (`Response.json`) so server failures properly bubble to router error boundaries.
  - Offline server detection interceptor within Axios.
  - Dedicated `/api/health-check` endpoint for server status monitoring.
- **PWA & Branding**:
  - Web App Manifest (`site.webmanifest`) configured with theme color tokens and icons.
  - Complete favicon set and accessible application logo with descriptive alt text.

---

## [0.0.0] - Before Release V1

### Added

- Monorepo workspace scaffolding for client (Vite + React) and server (Express + Prisma).
- PostgreSQL database setup with Prisma ORM (`User` and `RefreshToken` models).
- Base Tailwind CSS and shadcn/ui initialization.
- Tooling setup: ESLint, Prettier, Husky, and lint-staged.
- Initial database seed scripts for development.
