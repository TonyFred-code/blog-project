import { remark } from "remark";
import strip from "strip-markdown";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import { PostStatus } from "../generated/prisma/index.js";

function slugify(text) {
  return text
    .toString()
    .normalize("NFKD") // Split accented characters into base letters + diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (e.g., "café" -> "cafe")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Strip invalid non-alphanumeric chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens into one
    .replace(/^-+|-+$/g, ""); // Trim leading and trailing hyphens
}

function generateHashedSlug(title) {
  const baseSlug = slugify(title);
  const nanoid = customAlphabet(nolookalikes, 6);
  const shortId = nanoid();

  return `${baseSlug}-${shortId}`;
}

const stripKeepNodes = ["code", "inlineCode", "thematicBreak", "link"];

function getPlainTextLength(markdown = "") {
  try {
    const file = remark()
      .use(strip, { keep: stripKeepNodes })
      .processSync(markdown);

    return String(file).length;
  } catch (error) {
    console.error(error);
    return markdown.length;
  }
}

/**
 *
 * @param {string} status - Post status to be checked
 * @returns true if post matches on of PostStatus: DRAFT | PUBLISHED | UNPUBLISHED and false otherwise
 */
function isValidPostStatus(status) {
  return Object.values(PostStatus).includes(status);
}

function isValidPostStatusTransition(status, nextStatus) {
  const VALID_TRANSITIONS = {
    [PostStatus.DRAFT]: [PostStatus.PUBLISHED],
    [PostStatus.PUBLISHED]: [PostStatus.UNPUBLISHED, PostStatus.DRAFT],
    [PostStatus.UNPUBLISHED]: [PostStatus.DRAFT, PostStatus.PUBLISHED],
  };

  return VALID_TRANSITIONS[status]?.includes(nextStatus) ?? false;
}

export {
  generateHashedSlug,
  getPlainTextLength,
  isValidPostStatus,
  isValidPostStatusTransition,
};
