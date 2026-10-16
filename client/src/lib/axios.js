import axios from "axios";

let inMemoryToken = null;
let onSessionExpired = null;
let refreshPromise = null;

function setAccessToken(token) {
  inMemoryToken = token;
}

function getAccessToken() {
  return inMemoryToken;
}

function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Inject Access Token into all outgoing requests
api.interceptors.request.use((config) => {
  if (inMemoryToken) {
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

const NO_REFRESH_PATHS = ["/login", "/logout", "/register", "/token-refresh"];

function shouldSkipRefresh(url = "") {
  return NO_REFRESH_PATHS.includes(url.split("?")[0]);
}

// Response interceptor to automatically refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 ||
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
