import axios from "axios";

let inMemoryToken = null;
let onSessionExpired = null;
let refreshPromise = null;
let authInitialized = false;
let authInitPromise = null;

const NO_REFRESH_PATHS = ["/login", "/logout", "/register", "/token-refresh"];
const NO_AUTH_PATHS = ["/login", "/register", "/token-refresh"];

function setAccessToken(token) {
  authInitialized = true;
  inMemoryToken = token;
}

function getAccessToken() {
  return inMemoryToken;
}

function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

function ensureAuthInitialized() {
  if (authInitialized || inMemoryToken) {
    return Promise.resolve(inMemoryToken);
  }

  if (!authInitPromise) {
    authInitPromise = refreshAccessToken()
      .then((data) => {
        return data?.token || null;
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        authInitPromise = null;
        authInitialized = true;
      });
  }

  return authInitPromise;
}

// Inject Access Token into all outgoing requests
api.interceptors.request.use(async (config) => {
  const path = config.url ? config.url.split("?")[0] : "";

  if (!NO_AUTH_PATHS.includes(path)) {
    await ensureAuthInitialized();
  }

  if (inMemoryToken && !NO_AUTH_PATHS.includes(path)) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }

  return config;
});

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/token-refresh")
      .then((response) => {
        setAccessToken(response.data.token);
        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function shouldSkipRefresh(url = "") {
  return NO_REFRESH_PATHS.includes(url.split("?")[0]);
}

// Response interceptor to automatically refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isServerOffline =
      !error.response || [502, 503, 504].includes(error.response?.status);

    if (isServerOffline) {
      return Promise.reject({
        isNetworkError: true,
        title: "Connection Failed",
        status: 503,
        message:
          "Unable to reach the server. Please check your connection or try again.",
        originalError: error,
      });
    }

    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { token } = await refreshAccessToken();
      originalRequest.headers["Authorization"] = `Bearer ${token}`;

      return api(originalRequest);
    } catch (refreshError) {
      if (refreshError.response?.status === 401) {
        setAccessToken(null);
        onSessionExpired?.();
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
export {
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  setSessionExpiredHandler,
};
