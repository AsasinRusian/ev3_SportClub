/*
 * authService.js — Lógica de autenticación y sesión.
 * Separa las llamadas al backend del diseño de los componentes.
 */
import { api } from "./api.js";

/* ---- Llamadas al backend ---- */

export async function loginUser(credentials) {
  // credentials: { email, password }
  return api.post("/auth/login", credentials);
}

export async function registerUser(payload) {
  // payload: { full_name, email, password }
  return api.post("/auth/register", payload);
}

/* ---- Manejo de sesión en localStorage ---- */

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

/* ---- Perfil del usuario autenticado ---- */

// Actualiza los datos personales del perfil (no email ni rol).
export async function updateProfile(payload) {
  const res = await api.put("/auth/profile", payload);
  // Refresca el usuario guardado en sesión con los nuevos datos.
  if (res?.data?.user) {
    const token = getToken();
    saveSession(token, res.data.user);
  }
  return res;
}

// Cambia la contraseña del usuario autenticado.
export async function changePassword(payload) {
  return api.put("/auth/password", payload);
}

/* Devuelve la ruta del dashboard según el rol */
export function dashboardPathForRole(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "coach") return "/coach/dashboard";
  return "/user/dashboard";
}
