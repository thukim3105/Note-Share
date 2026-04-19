import api from "./client.js";

/**
 * Utils
 */
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.users)) return data.users;
  return [];
};

/**
 * Thin wrapper over api.request (no token here → handled in interceptor)
 */
const http = async (path, { method = "GET", body, params, raw } = {}) => {
  const res = await api.request({
    url: path,
    method,
    params: cleanParams(params),
    data: body,
  });
  return raw ? res : res.data;
};

/**
 * Auth
 */
export const loginAdmin = (payload) =>
  http("/admin/auth/login", { method: "POST", body: payload });

/**
 * Users
 */
export const getUsers = async (filters = {}) => {
  const res = await http("/admin/users", { params: filters, raw: true });

  return {
    users: normalizeList(res.data),
    meta: res.meta ?? null,
    pagination: res.meta?.pagination ?? res.pagination ?? null,
  };
};

export const createUser = (payload) =>
  http("/admin/users", { method: "POST", body: payload });

export const updateUser = (userId, payload) =>
  http(`/admin/users/${userId}`, { method: "PUT", body: payload });

export const deleteUser = (userId) =>
  http(`/admin/users/${userId}`, { method: "DELETE" });

export const restoreUser = (userId) =>
  http(`/admin/users/${userId}/restore`, { method: "POST" });

/**
 * Bulk
 */
export const bulkDeleteUsers = (userIds) =>
  http("/admin/users", {
    method: "DELETE",
    body: { user_ids: userIds },
  });

export const bulkCreateUsers = (users) =>
  http("/admin/users/bulk/create", {
    method: "POST",
    body: { users },
  });

export const bulkUpdateUsers = (users) =>
  http("/admin/users/bulk/update", {
    method: "PUT",
    body: { users },
  });
