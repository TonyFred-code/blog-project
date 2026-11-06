import { Router } from "express";
import {
  createPost,
  getPosts,
  viewPost,
} from "../controller/post.controller.js";
import { createPostValidationRules } from "../validator/post.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";
import { jwtStrategyAuth } from "../middleware/authGuards.js";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.get("/:slug", viewPost);
postRouter.post(
  "/",
  jwtStrategyAuth,
  createPostValidationRules,
  handleValidationError,
  createPost
);

export { postRouter };
