import { api } from "./api.js";

export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function createUser(payload) {
  const res = await api.post("/users", payload, true);
  return res.data;
}

export async function updateUser(id, payload) {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id) {
  return api.del(`/users/${id}`);
}
