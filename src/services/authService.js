import { api } from "./api.js";


export async function loginUser(credentials) {
  return api.post("/auth/login", credentials);
}

export async function registerUser(payload) {
  return api.post("/auth/register", payload);
}


export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getRole() {
  return getUser()?.role || null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


export async function updateProfile(payload) {
  const res = await api.put("/auth/me", payload);
  const updated = res?.data?.user || res?.data; 
  if (updated) {
    const token = getToken();
    saveSession(token, updated);
  }
  return { user: updated };
}


export async function changePassword(payload) {
  return api.put("/auth/me/password", payload);
}


export function dashboardPathForRole(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "coach") return "/coach/dashboard";
  return "/user/dashboard";
}
