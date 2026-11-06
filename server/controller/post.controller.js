import { POST_ERROR_CODES } from "../constants/errorCodes.js";
import {
  createPost as createPostDB,
  getPostBySlug as getPostBySlugDB,
  getPosts as getPostsDB,
} from "../db/post.js";
import { AppError } from "../lib/errorUtils.js";
import { generateHashedSlug } from "../lib/postUtils.js";

async function getPosts(req, res) {
  const limit = 10;
  const cursor = req.query.cursor;

  try {
    const response = await getPostsDB(limit, cursor);

    return res.json({ success: true, data: { ...response } });
  } catch (error) {
    if (error instanceof AppError) {
      let message;

      if (error.errorCode === POST_ERROR_CODES.POST_RETRIEVAL_FAILED) {
        message = "Failed to retrieve posts. Please try again.";
      } else {
        message = "Something went wrong. Please try again.";
      }

      return res.status(error.statusCode).json({
        success: false,
        message,
        errors: [],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
      errors: [],
    });
  }
}

async function createPost(req, res) {
  const userId = req.user.id;

  const { content, title, subtitle } = req.body;
  const slug = generateHashedSlug(title);

  try {
    const post = await createPostDB(content, userId, title, subtitle, slug);
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error instanceof AppError) {
      let errors = [];
      if (error.errorCode === POST_ERROR_CODES.POST_CREATION_FAILED) {
        errors.push({
          field: "general",
          message: "Failed to create post. Please try again.",
        });
      } else {
        errors.push({
          field: "general",
          message: "Something went wrong. Please try again later.",
        });
      }
      return res.status(error.statusCode).json({
        success: false,
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      errors: [{ field: "general", message: "Internal server error." }],
    });
  }
}

async function viewPost(req, res) {
  const slug = req.params.slug;

  try {
    const post = await getPostBySlugDB(slug);
    return res.status(200).json({
      data: post,
    });
  } catch (error) {
    if (error instanceof AppError) {
      let errMsg = "Something went wrong. Please try again later.";

      if (error.errorCode === POST_ERROR_CODES.POST_NOT_FOUND) {
        errMsg = "Post not found. Please try again.";
      }

      return res.status(error.statusCode).json({
        success: false,
        message: errMsg,
        errors: [],
      });
    }

    return res.status(500).json({
      success: false,
      errors: [],
      message: "Internal server error. Please try again later.",
    });
  }
}

export { createPost, viewPost, getPosts };
