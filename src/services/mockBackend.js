const USERS_KEY = "mock_users_db_v2";
const SPORTS_KEY = "mock_sports_db_v2";

const USER_SEED = [
  { id: 1, full_name: "Demo Admin 1", email: "admin1@demo.cl", password: "12345678", role: "admin", birth_date: "1990-09-01", createdAt: "2024-05-12T10:30:00Z" },
  { id: 2, full_name: "Demo Coach 1", email: "coach1@demo.cl", password: "12345678", role: "coach", birth_date: "1995-05-18", createdAt: "2024-05-12T11:15:00Z" },
  { id: 3, full_name: "Demo User 1",  email: "user1@demo.cl",  password: "12345678", role: "user",  birth_date: "2000-01-10", createdAt: "2024-05-12T12:45:00Z" },
];

const SPORT_SEED = [
  { id: 1, name: "CrossFit", objective: "Mejorar fuerza, resistencia y condición física general.", duration: 60, status: true,  created_at: "2026-07-15T14:30:00Z", updated_at: "2026-07-15T14:30:00Z" },
  { id: 2, name: "Yoga", objective: "Mejorar flexibilidad, equilibrio y bienestar mental.", duration: 50, status: true, created_at: "2026-07-15T14:30:00Z", updated_at: "2026-07-15T14:30:00Z" },
  { id: 3, name: "Spinning", objective: "Aumentar la resistencia cardiovascular mediante ciclismo indoor.", duration: 45, status: false, created_at: "2026-07-15T14:30:00Z", updated_at: "2026-07-15T14:30:00Z" },
];

function load(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(seed));
  return [...seed];
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function loadUsers() { return load(USERS_KEY, USER_SEED); }
function saveUsers(u) { save(USERS_KEY, u); }
function loadSports() { return load(SPORTS_KEY, SPORT_SEED); }
function saveSports(s) { save(SPORTS_KEY, s); }

function publicUser(u) { const { password, ...rest } = u; return rest; }
function delay(ms = 300) { return new Promise((r) => setTimeout(r, ms)); }
function nextId(arr) { return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1; }

function currentUser() {
  const token = localStorage.getItem("token") || "";
  const id = Number(token.replace("mock-token-", ""));
  return loadUsers().find((u) => u.id === id) || null;
}
function requireAuth() {
  const u = currentUser();
  if (!u) throw new Error("No autenticado. Debe iniciar sesión.");
  return u;
}

export async function mockRequest(path, { method = "GET", body } = {}) {
  await delay();
  const users = loadUsers();

  if (path === "/auth/login" && method === "POST") {
    const user = users.find((u) => u.email === body.email.trim().toLowerCase());
    if (!user || user.password !== body.password) throw new Error("Credenciales inválidas.");
    return { ok: true, message: "Login exitoso.", data: { token: `mock-token-${user.id}`, user: publicUser(user) } };
  }

  if (path === "/auth/register" && method === "POST") {
    if (users.some((u) => u.email === body.email.trim().toLowerCase())) throw new Error("El correo ya está registrado.");
    const user = {
      id: nextId(users), full_name: body.full_name.trim(), email: body.email.trim().toLowerCase(),
      password: body.password, role: "user", birth_date: body.birth_date || null, createdAt: new Date().toISOString(),
    };
    users.push(user); saveUsers(users);
    return { ok: true, message: "Usuario registrado correctamente.", data: publicUser(user) };
  }

  if (path === "/auth/me" && method === "PUT") {
    const me = requireAuth();
    const idx = users.findIndex((u) => u.id === me.id);
    users[idx] = {
      ...users[idx],
      full_name: body.full_name?.trim() || users[idx].full_name,
      birth_date: body.birth_date ?? users[idx].birth_date,
    };
    saveUsers(users);
    return { ok: true, message: "Perfil actualizado correctamente.", data: publicUser(users[idx]) };
  }

  if (path === "/auth/me/password" && method === "PUT") {
    const me = requireAuth();
    const idx = users.findIndex((u) => u.id === me.id);
    if (users[idx].password !== body.current_password) throw new Error("La contraseña actual es incorrecta.");
    users[idx] = { ...users[idx], password: body.new_password };
    saveUsers(users);
    return { ok: true, message: "Contraseña actualizada correctamente." };
  }


  if (path === "/users" && method === "GET") {
    requireAuth();
    return { ok: true, message: "Listado de usuarios.", data: users.map(publicUser).reverse() };
  }
  if (path === "/users" && method === "POST") {
    requireAuth();
    if (users.some((u) => u.email === body.email.trim().toLowerCase())) throw new Error("El correo ya está registrado.");
    const user = { id: nextId(users), full_name: body.full_name.trim(), email: body.email.trim().toLowerCase(), password: body.password, role: body.role, createdAt: new Date().toISOString() };
    users.push(user); saveUsers(users);
    return { ok: true, message: "Usuario creado correctamente.", data: publicUser(user) };
  }
  const userId = path.match(/^\/users\/(\d+)$/);
  if (userId) {
    const me = requireAuth();
    const id = Number(userId[1]);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado.");
    if (method === "PUT") {
      users[idx] = { ...users[idx], full_name: body.full_name?.trim() ?? users[idx].full_name, email: body.email?.trim().toLowerCase() ?? users[idx].email, role: body.role ?? users[idx].role, password: body.password ? body.password : users[idx].password };
      saveUsers(users);
      return { ok: true, message: "Usuario actualizado correctamente.", data: publicUser(users[idx]) };
    }
    if (method === "DELETE") {
      if (id === me.id) throw new Error("No puedes eliminar tu propio usuario.");
      const removed = users.splice(idx, 1)[0]; saveUsers(users);
      return { ok: true, message: "Usuario eliminado correctamente.", data: publicUser(removed) };
    }
  }

  /* ---------- SPORTS ---------- */
  const sports = loadSports();
  if (path === "/sport" && method === "GET") {
    requireAuth();
    return { ok: true, message: "Listado de deportes.", data: [...sports].reverse() };
  }
  if (path === "/sport" && method === "POST") {
    requireAuth();
    const now = new Date().toISOString();
    const sport = { id: nextId(sports), name: body.name.trim(), objective: body.objective.trim(), duration: Number(body.duration), status: body.status ?? true, created_at: now, updated_at: now };
    sports.push(sport); saveSports(sports);
    return { ok: true, message: "Deporte creado correctamente.", data: sport };
  }
  const sportStatus = path.match(/^\/sport\/(\d+)\/status$/);
  if (sportStatus && method === "PATCH") {
    requireAuth();
    const id = Number(sportStatus[1]);
    const idx = sports.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Deporte no encontrado.");
    sports[idx] = { ...sports[idx], status: body.status, updated_at: new Date().toISOString() };
    saveSports(sports);
    return { ok: true, message: "Estado del deporte actualizado correctamente.", data: sports[idx] };
  }
  const sportId = path.match(/^\/sport\/(\d+)$/);
  if (sportId) {
    requireAuth();
    const id = Number(sportId[1]);
    const idx = sports.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Deporte no encontrado.");
    if (method === "PUT") {
      sports[idx] = { ...sports[idx], name: body.name?.trim() ?? sports[idx].name, objective: body.objective?.trim() ?? sports[idx].objective, duration: body.duration !== undefined ? Number(body.duration) : sports[idx].duration, status: body.status ?? sports[idx].status, updated_at: new Date().toISOString() };
      saveSports(sports);
      return { ok: true, message: "Deporte actualizado correctamente.", data: sports[idx] };
    }
    if (method === "DELETE") {
      sports.splice(idx, 1); saveSports(sports);
      return { ok: true, message: "Deporte eliminado correctamente." };
    }
  }

  throw new Error("Ruta no encontrada (mock).");
}