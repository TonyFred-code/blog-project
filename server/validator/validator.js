import { ExpressValidator } from "express-validator";

const customValidator = new ExpressValidator(
  {},
  {},
  {
    errorFormatter: (err) => {
      return {
        field: err.path,
        message: err.msg,
      };
    },
  }
);

export const { body, validationResult } = customValidator;

export default validationResult;
