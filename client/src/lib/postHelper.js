import {
  MAX_POST_CHARS_COUNT,
  MAX_SUBTITLE_CHARS_COUNT,
  MAX_TITLE_CHARS_COUNT,
} from "@/constants/postConstants";
import api from "@/lib/axios";
import { normalizeApiError } from "@/lib/errorHelper";
import { withMinDelay } from "@/lib/loaderUtils";
import { replace } from "react-router-dom";

function validateTitle(value) {
  if (!value.trim()) return [{ message: "Post title is required." }];

  if (value.length > MAX_TITLE_CHARS_COUNT) {
    return [
      { message: `Title cannot exceed ${MAX_TITLE_CHARS_COUNT} characters.` },
    ];
  }

  return [];
}

function validateSubtitle(value) {
  if (value && value.length > MAX_SUBTITLE_CHARS_COUNT) {
    return [
      {
        message: `Subtitle cannot exceed ${MAX_SUBTITLE_CHARS_COUNT} characters.`,
      },
    ];
  }

  return [];
}

function validateContent(value, stats) {
  if (!value.trim()) return [{ message: "Post content is required." }];

  if (stats.characters > MAX_POST_CHARS_COUNT) {
    return [
      {
        message: `Content cannot exceed limit of ${MAX_POST_CHARS_COUNT} characters`,
      },
    ];
  }

  return [];
}

async function handleCreateNewPost({ content, title, subtitle }) {
  try {
    const response = await withMinDelay(
      api.post("/posts", {
        content,
        title,
        subtitle,
      }),
      150
    );

    const dataObj = response.data.data;
    return replace(`/post/${dataObj.slug}`);
  } catch (error) {
    return normalizeApiError(error);
  }
}

async function createNewPostAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return handleCreateNewPost(data);
}

async function viewPostLoader({ params }) {
  try {
    const response = await withMinDelay(api.get(`/posts/${params.slug}`));
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw Response.json(
        {
          message:
            "The post you are looking for does not exist or has been removed.",
        },
        { status: 404 }
      );
    }

    return normalizeApiError(error);
  }
}

export {
  createNewPostAction,
  viewPostLoader,
  validateTitle,
  validateSubtitle,
  validateContent,
};
