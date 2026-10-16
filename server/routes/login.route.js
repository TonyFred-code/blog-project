import { Router } from "express";
import {
  localStrategyAuth,
  restrictIfAuthenticated,
} from "../middleware/authGuards.js";
import { loginPost } from "../controller/login.controller.js";
import { loginValidationRules } from "../validator/login.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";

const loginRouter = Router();

loginRouter.post(
  "/",
  loginValidationRules,
  handleValidationError,
  restrictIfAuthenticated,
  localStrategyAuth,
  loginPost
);

export { loginRouter };
