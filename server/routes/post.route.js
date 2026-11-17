import { Router } from "express";
import {
  createPost,
  getPosts,
  getOwnPost,
  updatePost,
  viewPost,
  deletePost,
} from "../controller/post.controller.js";
import { postValidationRules } from "../validator/post.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";
import { jwtStrategyAuth } from "../middleware/authGuards.js";
import { postOwnershipGuard } from "../middleware/postGuards.js";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.get(
  "/:slug/manage",
  jwtStrategyAuth,
  postOwnershipGuard,
  getOwnPost
);
postRouter.get("/:slug/edit", jwtStrategyAuth, postOwnershipGuard, getOwnPost);
postRouter.patch(
  "/:slug",
  jwtStrategyAuth,
  postOwnershipGuard,
  postValidationRules,
  handleValidationError,
  updatePost
);
postRouter.delete("/:slug", jwtStrategyAuth, postOwnershipGuard, deletePost);
postRouter.get("/:slug", viewPost);
postRouter.post(
  "/",
  jwtStrategyAuth,
  postValidationRules,
  handleValidationError,
  createPost
);

export { postRouter };
