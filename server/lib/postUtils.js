import { remark } from "remark";
import strip from "strip-markdown";
import { nanoid } from "nanoid";

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
  const shortId = nanoid(6);

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

export { generateHashedSlug, getPlainTextLength };
