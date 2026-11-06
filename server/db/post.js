import { POST_ERROR_CODES } from "../constants/errorCodes.js";
import { AppError } from "../lib/errorUtils.js";
import prisma from "./prisma.js";

async function getPosts(limit, cursor) {
  try {
    const posts = await prisma.post.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { slug: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        createdAt: true,
        author: { select: { email: true } },
      },
    });

    let nextCursor = null;
    if (posts.length > limit) {
      posts.pop();
      nextCursor = posts[posts.length - 1].slug;
    }

    return { posts, nextCursor };
  } catch (error) {
    console.error(error);
    const err = new AppError(
      "Failed to fetch posts",
      500,
      POST_ERROR_CODES.POST_RETRIEVAL_FAILED
    );

    throw err;
  }
}

async function createPost(content, authorId, title, subtitle, slug) {
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
        title,
        subtitle,
        slug,
        published: true,
      },
    });

    return post;
  } catch (error) {
    console.error(error);
    const err = new AppError(
      "Failed to create post",
      500,
      POST_ERROR_CODES.POST_CREATION_FAILED
    );

    throw err;
  }
}

async function getPostBySlug(slug) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new AppError(
        "Post not found",
        404,
        POST_ERROR_CODES.POST_NOT_FOUND
      );
    }

    return post;
  } catch (error) {
    console.error(error);
    const err = new AppError(
      "Failed to get post",
      404,
      POST_ERROR_CODES.POST_NOT_FOUND
    );

    throw err;
  }
}

export { createPost, getPostBySlug, getPosts };
