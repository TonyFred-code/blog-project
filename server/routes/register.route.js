import { Router } from "express";
import { restrictIfAuthenticated } from "../middleware/authGuards.js";
import { registerPost } from "../controller/register.controller.js";
import { registerValidationRules } from "../validator/register.validator.js";
import { handleValidationError } from "../validator/validationHandler.js";

const registerRouter = Router();

registerRouter.post(
  "/",
  registerValidationRules,
  handleValidationError,
  restrictIfAuthenticated,
  registerPost
);

export { registerRouter };
