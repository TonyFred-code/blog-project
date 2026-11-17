import { hashPassword } from "../../lib/passwordUtils.js";
import { generateHashedSlug } from "../../lib/postUtils.js";
import prisma from "../prisma.js";

const usersData = [
  { email: "alice@example.com", password: "hashed_password_123" },
  { email: "alfred@example.com", password: "@Q@ue76hLDBS9YS" },
  {
    email: "bob@example.com",
    password: "hashed_password_456",
  },
  {
    email: "charlie@example.com",
    password: "hashed_password_789",
  },
];

const postsData = [
  {
    title: "Hello, World",
    subtitle: "My very first post",
    content: "Welcome to the blog. Excited to start sharing what I learn.",
    published: true,
    authorIndex: 0,
  },
  {
    title: "Why I Love TypeScript",
    subtitle: "Types as documentation",
    content: "Types catch bugs early and double as living documentation.",
    published: true,
    authorIndex: 1,
  },
  {
    title: "Getting Started with Prisma",
    subtitle: "An ORM that feels natural",
    content:
      "Define a schema, run a migration, and query with full type safety.",
    published: true,
    authorIndex: 2,
  },
  {
    title: "Understanding JWT Refresh Tokens",
    subtitle: "Short-lived access, long-lived refresh",
    content:
      "Rotate refresh tokens on every use and revoke the whole family on reuse.",
    published: true,
    authorIndex: 3,
  },
  {
    title: "CSS Grid in 5 Minutes",
    subtitle: null,
    content:
      "Grid makes two-dimensional layouts simple. Start with grid-template-columns.",
    published: true,
    authorIndex: 0,
  },
  {
    title: "Flexbox vs Grid",
    subtitle: "Which one should you use?",
    content:
      "Flexbox for one dimension, Grid for two. They also work great together.",
    published: true,
    authorIndex: 1,
  },
  {
    title: "My Morning Dev Routine",
    subtitle: "Small habits, big gains",
    content:
      "Coffee, a quick review of yesterday's notes, then one focused hour of coding.",
    published: true,
    authorIndex: 2,
  },
  {
    title: "Debugging Like a Detective",
    subtitle: "Follow the evidence",
    content:
      "Reproduce the bug, form a hypothesis, test it, and repeat until solved.",
    published: true,
    authorIndex: 3,
  },
  {
    title: "Git Branching Basics",
    subtitle: null,
    content: "Branch often, commit small, and keep main clean and deployable.",
    published: true,
    authorIndex: 0,
  },
  {
    title: "Writing Better Commit Messages",
    subtitle: "Future you will say thanks",
    content: "Use the imperative mood and explain the why, not just the what.",
    published: true,
    authorIndex: 1,
  },
  {
    title: "React State, Simplified",
    subtitle: "useState without the confusion",
    content:
      "State is just memory for your component. Update it, and React re-renders.",
    published: true,
    authorIndex: 2,
  },
  {
    title: "When to Use useEffect",
    subtitle: "And when not to",
    content:
      "Use it to sync with external systems, not to derive values from props.",
    published: true,
    authorIndex: 3,
  },
  {
    title: "Express Middleware Explained",
    subtitle: null,
    content:
      "Middleware are functions that run between the request and the response.",
    published: true,
    authorIndex: 0,
  },
  {
    title: "REST API Design Tips",
    subtitle: "Keep it predictable",
    content:
      "Use nouns for routes, proper status codes, and consistent error shapes.",
    published: true,
    authorIndex: 1,
  },
  {
    title: "Password Hashing 101",
    subtitle: "Never store plain text",
    content:
      "Use bcrypt or argon2 with a proper cost factor. Never roll your own crypto.",
    published: true,
    authorIndex: 2,
  },
  {
    title: "Postgres Indexes in Plain English",
    subtitle: "Faster reads, slower writes",
    content: "An index is like a book's table of contents for your rows.",
    published: true,
    authorIndex: 3,
  },
  {
    title: "Deploying to Vercel",
    subtitle: "From push to production",
    content:
      "Connect your repo, set env variables, and every push becomes a deploy.",
    published: true,
    authorIndex: 0,
  },
  {
    title: "Dark Mode Done Right",
    subtitle: null,
    content:
      "Use CSS variables and respect the user's prefers-color-scheme setting.",
    published: true,
    authorIndex: 1,
  },
  {
    title: "Accessibility Is Not Optional",
    subtitle: "Build for everyone",
    content:
      "Semantic HTML, good contrast, and keyboard support go a long way.",
    published: true,
    authorIndex: 2,
  },
  {
    title: "Learning in Public",
    subtitle: "Share the messy middle",
    content: "Writing about what you learn solidifies it and helps others too.",
    published: true,
    authorIndex: 3,
  },
  {
    title: "Draft: Testing Strategies",
    subtitle: "Work in progress",
    content:
      "Notes on unit, integration, and end-to-end tests. To be expanded.",
    published: false,
    authorIndex: 0,
  },
  {
    title: "Draft: Docker for Beginners",
    subtitle: "Coming soon",
    content: "Containers explained simply. Outline only for now.",
    published: false,
    authorIndex: 1,
  },
  {
    title: "Draft: Web Performance Checklist",
    subtitle: null,
    content: "Images, fonts, bundles, and caching. Still gathering ideas.",
    published: false,
    authorIndex: 3,
  },
  {
    title: "Draft: Intro to Embedded Systems",
    subtitle: "A software dev's detour",
    content:
      "Microcontrollers, firmware, and why constraints make you a better dev.",
    published: false,
    authorIndex: 3,
  },
];

async function main() {
  console.log("Seeding database...");

  const users = [];
  for (const { email, password } of usersData) {
    const hashed = await hashPassword(password);
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashed },
      create: { email, password: hashed },
    });
    users.push(user);
    console.log(`User ready: ${user.email}`);
  }

  console.log(`Created ${users.length} user(s)`);

  // Posts (idempotent via upsert on unique slug)
  for (const { authorIndex, ...post } of postsData) {
    const slug = generateHashedSlug(post.title);

    await prisma.post.upsert({
      where: { slug },
      update: { ...post, slug, authorId: users[authorIndex].id },
      create: { ...post, slug, authorId: users[authorIndex].id },
    });
  }
  console.log(`Seeded ${postsData.length} post(s).`);
}

main()
  .catch((e) => {
    console.error(`Error seeding database`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
