import { body } from "./validator.js";

const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export { loginValidationRules };
