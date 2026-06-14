/*
 * mockBackend.js — Backend SIMULADO para probar el frontend sin servidor real.
 *
 * Permite probar login, registro, roles, dashboards, el CRUD de usuarios,
 * la edición de perfil y el cambio de contraseña antes de tener el backend
 * de la asignatura. Los datos viven en localStorage y se reinician al limpiar
 * el navegador.
 *
 * Se activa/desactiva con la constante USE_MOCK en api.js.
 */

const DB_KEY = "mock_users_db";

// Usuarios iniciales de demostración (uno por rol)
const SEED = [
  { id: 1, full_name: "Admin Demo",   email: "admin@demo.cl",   password: "admin123",   role: "admin", active: true, created_at: "2024-05-12T10:30:00", birthdate: "1990-03-15", favorite_sport: "CrossFit", metadata: "" },
  { id: 2, full_name: "Coach Demo",   email: "coach@demo.cl",   password: "coach123",   role: "coach", active: true, created_at: "2024-05-12T11:15:00", birthdate: "1988-07-22", favorite_sport: "Spinning", metadata: "" },
  { id: 3, full_name: "Usuario Demo", email: "usuario@demo.cl", password: "usuario123", role: "user",  active: true, created_at: "2024-05-12T12:45:00", birthdate: "1995-11-02", favorite_sport: "Fútbol", metadata: "" },
];

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED));
    return [...SEED];
  }

  // Migración: completa datos faltantes en bases guardadas con versiones previas
  // (por ejemplo, usuarios sin fecha de registro o sin campos de perfil).
  const users = JSON.parse(raw);
  let changed = false;
  for (const u of users) {
    if (!u.created_at) {
      const seed = SEED.find((s) => s.email === u.email);
      u.created_at = seed ? seed.created_at : new Date().toISOString();
      changed = true;
    }
    if (u.birthdate === undefined) { u.birthdate = ""; changed = true; }
    if (u.favorite_sport === undefined) { u.favorite_sport = ""; changed = true; }
    if (u.metadata === undefined) { u.metadata = ""; changed = true; }
  }
  if (changed) localStorage.setItem(DB_KEY, JSON.stringify(users));
  return users;
}

function saveDB(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

function delay(ms = 350) {
  return new Promise((res) => setTimeout(res, ms));
}

function nextId(users) {
  return users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

function currentUserFromToken() {
  const token = localStorage.getItem("token") || "";
  const id = Number(token.replace("mock-token-", ""));
  const users = loadDB();
  return users.find((u) => u.id === id) || null;
}

function requireAuth() {
  const user = currentUserFromToken();
  if (!user) throw new Error("No autenticado. Debe iniciar sesión.");
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (user.role !== "admin") {
    throw new Error("No tiene permisos para realizar esta acción.");
  }
  return user;
}

export async function mockRequest(path, { method = "GET", body } = {}) {
  await delay();
  const users = loadDB();

  // ----- AUTH -----
  if (path === "/auth/login" && method === "POST") {
    const { email, password } = body;
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    if (!user.active) {
      throw new Error("La cuenta está deshabilitada. Contacte al administrador.");
    }
    return {
      ok: true,
      message: "Login exitoso.",
      data: { token: `mock-token-${user.id}`, user: publicUser(user) },
    };
  }

  if (path === "/auth/register" && method === "POST") {
    const { full_name, email, password, birthdate, favorite_sport } = body;
    if (users.some((u) => u.email === email.trim().toLowerCase())) {
      throw new Error("El correo ya está registrado.");
    }
    const user = {
      id: nextId(users),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "user",
      active: true,
      created_at: new Date().toISOString(),
      birthdate: birthdate || "",
      favorite_sport: favorite_sport || "",
      metadata: "",
    };
    users.push(user);
    saveDB(users);
    return {
      ok: true,
      message: "Registro exitoso.",
      data: { token: `mock-token-${user.id}`, user: publicUser(user) },
    };
  }

  // ----- PERFIL (usuario autenticado) -----
  if (path === "/auth/profile" && method === "PUT") {
    const me = requireAuth();
    const idx = users.findIndex((u) => u.id === me.id);
    const { full_name, birthdate, favorite_sport, metadata } = body;
    // No se permite cambiar email ni rol desde el perfil.
    users[idx] = {
      ...users[idx],
      full_name: full_name?.trim() || users[idx].full_name,
      birthdate: birthdate ?? users[idx].birthdate,
      favorite_sport: favorite_sport ?? users[idx].favorite_sport,
      metadata: metadata ?? users[idx].metadata,
    };
    saveDB(users);
    return { ok: true, message: "Perfil actualizado correctamente.", data: { user: publicUser(users[idx]) } };
  }

  if (path === "/auth/password" && method === "PUT") {
    const me = requireAuth();
    const idx = users.findIndex((u) => u.id === me.id);
    const { current_password, new_password } = body;
    if (users[idx].password !== current_password) {
      throw new Error("La contraseña actual es incorrecta.");
    }
    users[idx] = { ...users[idx], password: new_password };
    saveDB(users);
    return { ok: true, message: "Contraseña actualizada correctamente." };
  }

  // ----- USERS (CRUD, solo admin) -----
  if (path === "/users" && method === "GET") {
    requireAdmin();
    return { ok: true, data: users.map(publicUser).reverse() };
  }

  if (path === "/users" && method === "POST") {
    requireAdmin();
    const { full_name, email, password, role } = body;
    if (users.some((u) => u.email === email.trim().toLowerCase())) {
      throw new Error("El correo ya está registrado.");
    }
    const user = {
      id: nextId(users),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      active: true,
      created_at: new Date().toISOString(),
      birthdate: "",
      favorite_sport: "",
      metadata: "",
    };
    users.push(user);
    saveDB(users);
    return { ok: true, message: "Usuario creado correctamente.", data: publicUser(user) };
  }

  const idMatch = path.match(/^\/users\/(\d+)$/);
  if (idMatch) {
    const admin = requireAdmin();
    const id = Number(idMatch[1]);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado.");

    if (method === "PUT") {
      const { full_name, email, password, role, active } = body;
      if (users.some((u) => u.email === email.trim().toLowerCase() && u.id !== id)) {
        throw new Error("El correo ya está en uso por otro usuario.");
      }
      if (id === admin.id && role !== "admin") {
        throw new Error("No puede cambiar su propio rol de administrador.");
      }
      users[idx] = {
        ...users[idx],
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        role,
        active: active === undefined ? users[idx].active : active,
        password: password ? password : users[idx].password,
      };
      saveDB(users);
      return { ok: true, message: "Usuario actualizado correctamente.", data: publicUser(users[idx]) };
    }

    if (method === "DELETE") {
      if (id === admin.id) throw new Error("No puede eliminar su propia cuenta.");
      const removed = users.splice(idx, 1)[0];
      saveDB(users);
      return { ok: true, message: "Usuario eliminado correctamente.", data: publicUser(removed) };
    }
  }

  throw new Error("Ruta no encontrada (mock).");
}
