import {
  MAX_POST_CHAR_COUNT,
  MAX_SUBTITLE_CHARS_COUNT,
  MAX_TITLE_CHARS_COUNT,
} from "../constants/postConstants.js";
import { getPlainTextLength } from "../lib/postUtils.js";
import { body } from "./validator.js";

const createPostValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Post title is required.")
    .bail()
    .isLength({ max: MAX_TITLE_CHARS_COUNT })
    .withMessage(
      `Post title cannot exceed ${MAX_TITLE_CHARS_COUNT} characters.`
    ),
  body("subtitle")
    .trim()
    .optional({ values: "falsy" })
    .isLength({ max: MAX_SUBTITLE_CHARS_COUNT })
    .withMessage(
      `Post sub title cannot exceed ${MAX_SUBTITLE_CHARS_COUNT} characters.`
    ),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required.")
    .bail()
    .custom((value) => {
      const characters = getPlainTextLength(value);

      if (characters > MAX_POST_CHAR_COUNT) {
        throw new Error(
          `Characters count (${characters}) exceeds limit of ${MAX_POST_CHAR_COUNT}`
        );
      }

      return true;
    }),
];

export { createPostValidationRules };
