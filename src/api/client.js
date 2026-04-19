import axios from "axios";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Token provider (single source of truth)
 * Replace this with your real auth storage logic.
 */
const getAccessToken = () => {
  return localStorage.getItem("admin_token") || localStorage.getItem("access_token");
};

/**
 * Soft check for standard API response
 */
const isApiResponse = (res) => {
  return res && typeof res === "object" && "success" in res;
};

/**
 * Normalize success (keep axios structure)
 */
const formatSuccess = (response) => {
  const res = response.data;

  return {
    ...response,
    data: res.data,
    meta: res.meta ?? null,
    message: res.message ?? null,
    pagination: res.pagination ?? null,
  };
};

/**
 * Normalize error
 */
const formatError = (res, status) => {
  const error = res?.error || {};

  return {
    code: error.code || "API_ERROR",
    message: error.message || res?.message || "Request failed",
    retryable: error.retryable ?? false,
    details: error.details ?? null,
    meta: res?.meta ?? null,
    status,
  };
};

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => {
    const res = response.data;

    // Standard API response
    if (isApiResponse(res)) {
      if (!res.success) {
        return Promise.reject(formatError(res, response.status));
      }

      return formatSuccess(response);
    }

    // Non-standard → pass through
    return response;
  },
  async (error) => {
    const response = error.response;
    const res = response?.data;

    // Handle standard API error
    if (res && isApiResponse(res)) {
      return Promise.reject(formatError(res, response.status));
    }

    // Handle auth (basic example)
    if (response?.status === 401) {
      // TODO: implement refresh token or logout
      // e.g. clearAuth(); window.location.href = "/login";
    }

    // Network / unknown error
    return Promise.reject({
      code: "NETWORK_ERROR",
      message: error.message || "Network request failed",
      retryable: false,
      status: response?.status ?? null,
      details: res ?? null,
    });
  },
);

/**
 * REQUEST WRAPPER
 */
export const request = async (
  path,
  { method = "GET", body, params, headers, raw = false } = {},
) => {
  const response = await api.request({
    url: path,
    method,
    params,
    data: body,
    headers,
  });

  return raw ? response : response.data;
};

export default api;
