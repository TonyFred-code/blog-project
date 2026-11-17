import { hashPassword } from "../../lib/passwordUtils.js";
import prisma from "../prisma.js";
import { SEED_POSTS_DATA } from "./seedPostsData.js";
import { SEED_USERS_DATA } from "./seedUsers.js";

async function main() {
  console.log("Seeding database...");

  const users = [];
  for (const { email, password } of SEED_USERS_DATA) {
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
  for (const { authorIndex, ...post } of SEED_POSTS_DATA) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...post, authorId: users[authorIndex].id },
      create: { ...post, authorId: users[authorIndex].id },
    });
  }
  console.log(`Seeded ${SEED_POSTS_DATA.length} post(s).`);
}

main()
  .catch((e) => {
    console.error(`Error seeding database`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
