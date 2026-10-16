import prisma from "./prisma.js";

async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

async function findUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

async function createUser(email, password) {
  const user = await prisma.user.create({
    data: { email, password },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

export { findUserByEmail, createUser, findUserById };
