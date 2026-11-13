import { POST_ERROR_CODES } from "../constants/errorCodes.js";
import { getPostBySlug as getPostBySlugDB } from "../db/post.js";
import { AppError } from "../lib/errorUtils.js";

async function postOwnershipGuard(req, res, next) {
  const { slug } = req.params;
  const { id: userId } = req.user;

  try {
    const post = await getPostBySlugDB(slug);

    if (post.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized action. User is unable to retrieve post due to insufficient access rights.",
        errors: [],
      });
    }

    req.post = post;
    return next();
  } catch (error) {
    let message = "",
      statusCode = 500;
    if (error instanceof AppError) {
      console.error(error);
      statusCode = error.statusCode;
      if (error.errorCode === POST_ERROR_CODES.POST_NOT_FOUND) {
        message = "Post not found. Please try again.";
      } else {
        message = "Something went wrong. Please try again.";
      }
    }

    return res.status(statusCode).json({
      success: false,
      message: message || "Internal server error. Please try again.",
      errors: [],
    });
  }
}

export { postOwnershipGuard };
