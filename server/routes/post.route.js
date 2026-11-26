import { Router } from "express";
import {
  createPost,
  getPosts,
  getOwnPost,
  updatePost,
  viewPost,
  deletePost,
  updatePostStatus,
} from "../controller/post.controller.js";
import {
  postStatusValidationRules,
  postValidationRules,
} from "../validator/post.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";
import { jwtStrategyAuth, optionalJwtAuth } from "../middleware/authGuards.js";
import { postOwnershipGuard } from "../middleware/postGuards.js";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.get(
  "/:slug/manage",
  jwtStrategyAuth,
  postOwnershipGuard,
  getOwnPost
);
postRouter.patch(
  "/:slug/status",
  jwtStrategyAuth,
  postStatusValidationRules,
  handleValidationError,
  postOwnershipGuard,
  updatePostStatus
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
postRouter.get("/:slug", optionalJwtAuth, viewPost);
postRouter.post(
  "/",
  jwtStrategyAuth,
  postValidationRules,
  handleValidationError,
  createPost
);

export { postRouter };
