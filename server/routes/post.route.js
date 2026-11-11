import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostToBeEdited,
  updatePost,
  viewPost,
} from "../controller/post.controller.js";
import { postValidationRules } from "../validator/post.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";
import { jwtStrategyAuth } from "../middleware/authGuards.js";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.get("/:slug/edit", jwtStrategyAuth, getPostToBeEdited);
postRouter.patch(
  "/:slug",
  jwtStrategyAuth,
  postValidationRules,
  handleValidationError,
  updatePost
);
postRouter.get("/:slug", viewPost);
postRouter.post(
  "/",
  jwtStrategyAuth,
  postValidationRules,
  handleValidationError,
  createPost
);

export { postRouter };
