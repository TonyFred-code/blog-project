import { AxiosError } from "axios";

function normalizeApiError(err) {
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

export { normalizeApiError };
