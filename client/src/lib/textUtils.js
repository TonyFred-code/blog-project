import { remark } from "remark";
import strip from "strip-markdown";

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

const segmenter = new Intl.Segmenter("en", { granularity: "word" });

function getWordCount(markdown = "") {
  try {
    const plainText = String(
      remark().use(strip, { keep: stripKeepNodes }).processSync(markdown)
    );
    const segments = segmenter.segment(plainText);

    let wordsCount = 0;

    for (const segment of segments) {
      if (segment.isWordLike) {
        wordsCount++;
      }
    }

    return wordsCount;
  } catch (error) {
    console.error(error);

    return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  }
}

export { getPlainTextLength, getWordCount };
