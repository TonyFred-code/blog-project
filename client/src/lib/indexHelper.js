import api from "@/lib/axios";
import { normalizeApiError } from "@/lib/errorHelper";

async function indexLoader() {
  try {
    const response = await api.get("/posts");

    return response.data;
  } catch (error) {
    return normalizeApiError(error);
  }
}

async function postsLoader({ request }) {
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor") || "";

    const response = await api.get(`/posts?cursor=${cursor}`);

    return response.data;
  } catch (error) {
    return normalizeApiError(error);
  }
}

export { indexLoader, postsLoader };
