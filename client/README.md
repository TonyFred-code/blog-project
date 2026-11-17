# Blog Project Client

The frontend client for the Blog application, built with React 19, Vite, Tailwind CSS v4, and shadcn/ui. It delivers a fast, responsive, and accessible blogging experience with rich text editing, seamless authentication, and markdown rendering.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/) (Data APIs with loaders, actions, and error boundaries)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (base-nova style, Zinc base palette, OKLCH color system)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Space Grotesk Variable Font
- **Rich Text Editor**: TipTap (`@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/markdown`, `@editorcn/editor`)
- **Markdown Rendering**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-sanitize`
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic JWT refresh interceptors and CSRF headers
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Navigation Feedback**: [NProgress](https://ricostacruz.com/nprogress/)
- **Avatars**: [DiceBear](https://www.dicebear.com/) identicons

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Features Built

### 1. Authentication & Session Management

- **User Authentication**: Login and registration views with real-time field validation and error banners.
- **Route Guards**:
  - `ProtectedRoute`: Protects author-only routes (`/new`, `/post/:slug/edit`, `/post/:slug/manage`), redirecting unauthenticated visitors to login.
  - `RestrictAuth`: Prevents logged-in users from accessing `/login` or `/register`.
- **JWT & Token Refresh**: Axios interceptors automatically request new access tokens on 401s via `/api/token-refresh` without disrupting the user.
- **Multi-Tab Sync**: Authentication events (login/logout/session expiry) synchronize instantly across all open browser tabs using the `BroadcastChannel` API.

### 2. Post Browsing & Feed

- **Cursor-Based Infinite Feed**: Home page (`/`) fetches posts with cursor pagination and automatically loads subsequent pages as the user scrolls.
- **Optimistic State**: Responsive feed cards displaying titles, subtitles, reading time, and formatted publication dates.

### 3. Post Reading

- **Markdown Rendering**: Posts render sanitized GitHub Flavored Markdown (tables, task lists, blockquotes, headings).
- **Code Highlighting**: Multi-language code snippets highlighted with `lowlight` and custom styling.
- **Author Actions**: If the viewer is the author, edit and manage shortcuts are displayed alongside the author avatar.

### 4. Post Creation & Editing

- **Multi-Stage Editor**:
  - **Stage 1 (Title & Subtitle)**: Clean, focused inputs with length limits and validation.
  - **Stage 2 (Content)**: Full-featured TipTap rich text markdown editor with formatting toolbar (headings, code blocks, lists, quotes, tables).
  - **Stage 3 (Preview)**: Side-by-side preview mode before submitting.
- **Live Statistics**: Real-time word counter and character counter tracking limits against schema constraints.
- **Lazy Loading**: Heavy editor modules are code-split and loaded on demand to keep initial bundle sizes lean.

### 5. Post Management

- **Management Hub (`/post/:slug/manage`)**:
  - **Overview**: Post status, metadata, and quick links.
  - **Analytics & Reports**: Dashboards for post performance and metrics.
  - **Settings & Safe Deletion**: Post deletion with a confirmation prompt (`sudo rm post <id>`) inside a shadcn alert dialog.

### 6. User Experience & Accessibility

- **Error Handling**: Dedicated `ErrorPage` providing tailored states for 404 Not Found, 5xx / unreachable servers, and general errors with retry functionality.
- **Top Loader**: Smooth progress bar indicator on asynchronous route transitions.
- **Flash Notifications**: Session-backed flash toasts notifying users of events across redirects (e.g., unauthorized access or successful deletions).
- **PWA & Theming**: Web App Manifest (`site.webmanifest`) and metadata aligned with the shadcn UI zinc/blue palette, complete with accessible logo alt attributes.

---

## Further Builds / Roadmap

- [ ] **Post Drafts & Publishing**:
  - Auto-saving draft posts and keeping them private until ready.
  - One-click publish / unpublish toggle buttons in the post management screen.
  - Visual status chips (`Draft` vs `Published`) in feeds and editor.
- [ ] **Comments & Reactions**:
  - Threaded comment section beneath each published post.
  - Like button and emoji reactions with animated optimistic counters.
  - Comment management (delete/edit own comments, author moderation).
- [ ] **User Dashboard**:
  - Centralized author dashboard listing all created posts with quick filters (all, published, drafts).
  - View counts, reading statistics, and engagement analytics.
  - User profile customization (display name, bio, avatar selection).
- [ ] **Theme Switcher**:
  - Dark mode, light mode, and system preference toggle using `next-themes`.
  - Header toggle button with smooth icon transitions.

---

## Project Structure

```text
client/
├── public/
│   ├── assets/              # Favicons and site.webmanifest
│   └── weblog-logo.svg      # App logo
├── src/
│   ├── components/          # Shared components (Header, PostFeed, PostView, Editor, etc.)
│   │   └── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── context/             # React context providers (AuthProvider)
│   ├── hooks/               # Custom hooks (useAuth)
│   ├── lib/                 # Utility functions, Axios client, error handlers, route helpers
│   ├── pages/               # Route page components (Index, Post, CreatePost, EditPost, ManagePost, ErrorPage)
│   ├── routes/              # React Router configuration
│   ├── index.css            # Tailwind CSS v4 directives and shadcn theme variables
│   ├── main.jsx             # React application entry point
│   └── App.jsx              # Application root layout
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Running backend API server (see `server/README.md`)

### Installation

From the monorepo root or inside the `client/` directory:

```bash
# Install dependencies from root
npm install

# Or inside client/
cd client
npm install
```

### Development Server

```bash
# From monorepo root
npm run dev

# Or run client only
npm run dev --workspace=client
```

The Vite dev server will start at `http://localhost:5173`. API requests to `/api` are automatically proxied to the backend running at `http://localhost:3000`.

### Building for Production

```bash
npm run build --workspace=client
```

Compiled assets will be output to the `client/dist/` directory.

### Code Quality

```bash
npm run lint --workspace=client        # Run ESLint
npm run lint:fix --workspace=client    # Run ESLint with auto-fix
npm run format --workspace=client      # Format code with Prettier
```
