import axios from "axios";

let inMemoryToken = null;
let sessionUser = null;
let isSessionRestored = false;
let sessionRestorePromise = null;
let onSessionExpired = null;
let refreshPromise = null;

const NO_REFRESH_PATHS = ["/login", "/logout", "/register", "/token-refresh"];

function shouldSkipRefresh(url = "") {
  return NO_REFRESH_PATHS.includes(url.split("?")[0]);
}

function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

function setAuthSession(user, token) {
  sessionUser = user;
  inMemoryToken = token;
  isSessionRestored = true;
}

function clearAuthSession() {
  sessionUser = null;
  inMemoryToken = null;
  isSessionRestored = false;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

function restoreSession() {
  if (isSessionRestored) {
    return Promise.resolve({ user: sessionUser, token: inMemoryToken });
  }

  if (sessionRestorePromise) return sessionRestorePromise;

  sessionRestorePromise = api
    .post("/token-refresh")
    .then((response) => {
      inMemoryToken = response.data.token;
      sessionUser = response.data.user;

      return { user: sessionUser, token: inMemoryToken };
    })
    .catch(() => {
      inMemoryToken = null;
      sessionUser = null;

      return { user: null, token: null };
    })
    .finally(() => {
      sessionRestorePromise = null;
      isSessionRestored = true;
    });

  return sessionRestorePromise;
}

// Inject Access Token into all outgoing requests
api.interceptors.request.use(async (config) => {
  const path = config.url ? config.url.split("?")[0] : "";

  if (!shouldSkipRefresh(path)) {
    await restoreSession();
  }

  if (inMemoryToken && !shouldSkipRefresh(path)) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }

  return config;
});

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = api
    .post("/token-refresh")
    .then((response) => {
      inMemoryToken = response.data.token;
      sessionUser = response.data.user;

      return response.data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
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
        clearAuthSession();
        onSessionExpired?.();
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
export {
  refreshAccessToken,
  setSessionExpiredHandler,
  setAuthSession,
  clearAuthSession,
  restoreSession,
};
