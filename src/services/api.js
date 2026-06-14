/*
 * api.js — Cliente HTTP central.
 * Centraliza la URL del backend, agrega el token JWT a cada petición
 * y normaliza el manejo de errores.
 */
import { mockRequest } from "./mockBackend.js";

/* =====================================================================
   INTERRUPTOR DE BACKEND
   ---------------------------------------------------------------------
   USE_MOCK = true   -> usa el backend SIMULADO (pruebas sin servidor).
   USE_MOCK = false  -> usa el backend REAL en API_URL.

   El dia de la evaluacion, pon USE_MOCK en false.
   ===================================================================== */
const USE_MOCK = true;

const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  // Modo simulado: responde desde mockBackend.js
  if (USE_MOCK) {
    return mockRequest(path, { method, body });
  }

  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (data?.errors?.length) {
      throw new Error(data.errors.map((e) => e.message).join(" "));
    }
    throw new Error(data?.message || "Ocurrió un error inesperado.");
  }

  return data;
}

export const api = {
  get: (path, auth = true) => request(path, { method: "GET", auth }),
  post: (path, body, auth = false) => request(path, { method: "POST", body, auth }),
  put: (path, body, auth = true) => request(path, { method: "PUT", body, auth }),
  del: (path, auth = true) => request(path, { method: "DELETE", auth }),
};

export { API_URL, USE_MOCK };
