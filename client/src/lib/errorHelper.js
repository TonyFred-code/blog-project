import { AxiosError } from "axios";

function normalizeApiError(err) {
  if (err?.isNetworkError) {
    throw Response.json(
      {
        message: err.message,
      },
      { status: 503, statusText: "Service unavailable" }
    );
  }

  if (err instanceof AxiosError && err.response?.data) {
    const { message, errors } = err.response.data;

    return {
      success: false,
      message: message || "Something went wrong. Please try again.",
      error: Array.isArray(errors) ? errors : [],
    };
  }

  return {
    success: false,
    message: "An unknown error occurred. Please try again.",
    error: [],
  };
}

function throwLoaderError(err) {
  if (err instanceof Response) {
    throw err;
  }

  if (err?.isNetworkError) {
    throw Response.json(
      {
        message: err.message,
      },
      { status: 503, statusText: "Service unavailable" }
    );
  }

  const status = err.response?.status || err.status || 500;
  const rawMessage = err.response?.data?.message;
  const message =
    typeof rawMessage === "string"
      ? rawMessage
      : typeof err.message === "string" && err.message
        ? err.message
        : "Something went wrong. Please try again.";

  throw Response.json(
    {
      message,
    },
    { status }
  );
}

export { normalizeApiError, throwLoaderError };
