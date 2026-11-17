const SEED_POSTS_DATA = [
  {
    title: "Hello, World",
    subtitle: "My very first post",
    content: "Welcome to the blog. Excited to start sharing what I learn.",
    published: true,
    authorIndex: 0,
    slug: "hello-world-TKHYNU",
  },
  {
    title: "Why I Love TypeScript",
    subtitle: "Types as documentation",
    content: "Types catch bugs early and double as living documentation.",
    published: true,
    authorIndex: 1,
    slug: "why-i-love-typescript-wdbTej",
  },
  {
    title: "Getting Started with Prisma",
    subtitle: "An ORM that feels natural",
    content:
      "Define a schema, run a migration, and query with full type safety.",
    published: true,
    authorIndex: 2,
    slug: "getting-started-with-prisma-g3NLwz",
  },
  {
    title: "Understanding JWT Refresh Tokens",
    subtitle: "Short-lived access, long-lived refresh",
    content:
      "Rotate refresh tokens on every use and revoke the whole family on reuse.",
    published: true,
    authorIndex: 3,
    slug: "understanding-jwt-refresh-tokens-R9RtcE",
  },
  {
    title: "CSS Grid in 5 Minutes",
    subtitle: null,
    content:
      "Grid makes two-dimensional layouts simple. Start with grid-template-columns.",
    published: true,
    authorIndex: 0,
    slug: "css-grid-in-5-minutes-3CGg79",
  },
  {
    title: "Flexbox vs Grid",
    subtitle: "Which one should you use?",
    content:
      "Flexbox for one dimension, Grid for two. They also work great together.",
    published: true,
    authorIndex: 1,
    slug: "flexbox-vs-grid-qQCU7P",
  },
  {
    title: "My Morning Dev Routine",
    subtitle: "Small habits, big gains",
    content:
      "Coffee, a quick review of yesterday's notes, then one focused hour of coding.",
    published: true,
    authorIndex: 2,
    slug: "my-morning-dev-routine-FqRYCc",
  },
  {
    title: "Debugging Like a Detective",
    subtitle: "Follow the evidence",
    content:
      "Reproduce the bug, form a hypothesis, test it, and repeat until solved.",
    published: true,
    authorIndex: 3,
    slug: "debugging-like-a-detective-6iUzPF",
  },
  {
    title: "Git Branching Basics",
    subtitle: null,
    content: "Branch often, commit small, and keep main clean and deployable.",
    published: true,
    authorIndex: 0,
    slug: "git-branching-basics-dkbRc7",
  },
  {
    title: "Writing Better Commit Messages",
    subtitle: "Future you will say thanks",
    content: "Use the imperative mood and explain the why, not just the what.",
    published: true,
    authorIndex: 1,
    slug: "writing-better-commit-messages-cFGwn4",
  },
  {
    title: "React State, Simplified",
    subtitle: "useState without the confusion",
    content:
      "State is just memory for your component. Update it, and React re-renders.",
    published: true,
    authorIndex: 2,
    slug: "react-state-simplified-niXFXc",
  },
  {
    title: "When to Use useEffect",
    subtitle: "And when not to",
    content:
      "Use it to sync with external systems, not to derive values from props.",
    published: true,
    authorIndex: 3,
    slug: "when-to-use-useeffect-bWVtJx",
  },
  {
    title: "Express Middleware Explained",
    subtitle: null,
    content:
      "Middleware are functions that run between the request and the response.",
    published: true,
    authorIndex: 0,
    slug: "express-middleware-explained-XC6JGB",
  },
  {
    title: "REST API Design Tips",
    subtitle: "Keep it predictable",
    content:
      "Use nouns for routes, proper status codes, and consistent error shapes.",
    published: true,
    authorIndex: 1,
    slug: "rest-api-design-tips-KE3kMC",
  },
  {
    title: "Password Hashing 101",
    subtitle: "Never store plain text",
    content:
      "Use bcrypt or argon2 with a proper cost factor. Never roll your own crypto.",
    published: true,
    authorIndex: 2,
    slug: "password-hashing-101-a7YKhF",
  },
  {
    title: "Postgres Indexes in Plain English",
    subtitle: "Faster reads, slower writes",
    content: "An index is like a book's table of contents for your rows.",
    published: true,
    authorIndex: 3,
    slug: "postgres-indexes-in-plain-english-hDLiXk",
  },
  {
    title: "Deploying to Vercel",
    subtitle: "From push to production",
    content:
      "Connect your repo, set env variables, and every push becomes a deploy.",
    published: true,
    authorIndex: 0,
    slug: "deploying-to-vercel-zgezpg",
  },
  {
    title: "Dark Mode Done Right",
    subtitle: null,
    content:
      "Use CSS variables and respect the user's prefers-color-scheme setting.",
    published: true,
    authorIndex: 1,
    slug: "dark-mode-done-right-qh7mfP",
  },
  {
    title: "Accessibility Is Not Optional",
    subtitle: "Build for everyone",
    content:
      "Semantic HTML, good contrast, and keyboard support go a long way.",
    published: true,
    authorIndex: 2,
    slug: "accessibility-is-not-optional-GNFa3h",
  },
  {
    title: "Learning in Public",
    subtitle: "Share the messy middle",
    content: "Writing about what you learn solidifies it and helps others too.",
    published: true,
    authorIndex: 3,
    slug: "learning-in-public-aT8XfJ",
  },
  {
    title: "Draft: Testing Strategies",
    subtitle: "Work in progress",
    content:
      "Notes on unit, integration, and end-to-end tests. To be expanded.",
    published: false,
    authorIndex: 0,
    slug: "draft-testing-strategies-x9KpgL",
  },
  {
    title: "Draft: Docker for Beginners",
    subtitle: "Coming soon",
    content: "Containers explained simply. Outline only for now.",
    published: false,
    authorIndex: 1,
    slug: "draft-docker-for-beginners-6bNxCa",
  },
  {
    title: "Draft: Web Performance Checklist",
    subtitle: null,
    content: "Images, fonts, bundles, and caching. Still gathering ideas.",
    published: false,
    authorIndex: 3,
    slug: "draft-web-performance-checklist-DwdMkJ",
  },
  {
    title: "Draft: Intro to Embedded Systems",
    subtitle: "A software dev's detour",
    content:
      "Microcontrollers, firmware, and why constraints make you a better dev.",
    published: false,
    authorIndex: 3,
    slug: "draft-intro-to-embedded-systems-Bd9CeJ",
  },
];

export { SEED_POSTS_DATA };
