import {
  MAX_POST_CHARS_COUNT,
  MAX_SUBTITLE_CHARS_COUNT,
  MAX_TITLE_CHARS_COUNT,
} from "@/constants/postConstants";
import api from "@/lib/axios";
import { normalizeApiError, throwLoaderError } from "@/lib/errorHelper";
import { withMinDelay } from "@/lib/loaderUtils";
import { AxiosError } from "axios";
import { redirect, replace } from "react-router-dom";

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
    const status = error.response?.status || error.status;

    if (status === 404) {
      throw Response.json(
        {
          message:
            "The post you are looking for does not exist or has been removed.",
        },
        { status: 404 }
      );
    }

    throwLoaderError(error);
  }
}

async function editPostLoader({ params }) {
  try {
    const response = await api.get(`/posts/${params.slug}/edit`);

    return response.data;
  } catch (error) {
    const status = error.response?.status || error.status;

    // If unauthorized, set session storage toast and redirect to public post view
    if (status === 403) {
      sessionStorage.setItem(
        "flash_post_error_toast",
        JSON.stringify({
          title: "Access Denied",
          description: "You can only edit your own posts.",
        })
      );
      throw redirect(`/post/${params.slug}`);
    }

    throwLoaderError(error);
  }
}

async function handleEditPost({ content, title, subtitle, slug }) {
  try {
    const response = await withMinDelay(
      api.patch(`/posts/${slug}`, {
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

async function editPostAction({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return handleEditPost({ ...data, slug: params.slug });
}

async function managePostLoader({ params }) {
  try {
    const response = await api.get(`/posts/${params.slug}/manage`);

    return response.data;
  } catch (error) {
    const status = error.response?.status || error.status;

    // If unauthorized, set session storage toast and redirect to public post view
    if (status === 403) {
      sessionStorage.setItem(
        "flash_post_error_toast",
        JSON.stringify({
          title: "Access Denied",
          description: "You can only manage your own posts.",
        })
      );
      throw redirect(`/post/${params.slug}`);
    }

    throwLoaderError(error);
  }
}

async function handleDeleteAction({ params }) {
  try {
    await withMinDelay(api.delete(`/posts/${params.slug}`));

    sessionStorage.setItem(
      "flash_manage_post_info_toast",
      JSON.stringify({
        title: "Post deleted",
        description: "Post has been successfully deleted.",
      })
    );

    return redirect("/");
  } catch (error) {
    const status = error.response?.status;

    if (status === 404) {
      sessionStorage.setItem(
        "flash_manage_post_info_toast",
        JSON.stringify({
          title: "Post deleted",
          description: "Post not found or has been deleted.",
        })
      );

      return redirect("/");
    }

    if (status === 403) {
      // probably redundant
      sessionStorage.setItem(
        "flash_post_error_toast",
        JSON.stringify({
          title: "Access Denied",
          description: "You can only delete your own posts.",
        })
      );
      return redirect(`/post/${params.slug}`);
    }

    return {
      success: false,
      message: "Failed to delete post",
      method: "DELETE",
    };
  }
}

async function managePostAction({ params, request }) {
  switch (request.method) {
    case "DELETE":
      return await handleDeleteAction({ params });
    default:
      sessionStorage.setItem(
        "flash_manage_post_error_toast",
        JSON.stringify({
          title: "Unknown action",
          description: "Unable to process unknown manage post action.",
        })
      );
      return normalizeApiError(new AxiosError("Unknown request type"));
  }
}

export {
  createNewPostAction,
  viewPostLoader,
  editPostLoader,
  editPostAction,
  validateTitle,
  validateSubtitle,
  validateContent,
  managePostLoader,
  managePostAction,
};
