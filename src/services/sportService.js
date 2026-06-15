import { api } from "./api.js";
const BASE = "/sport";

export async function getSports() {
  const res = await api.get(BASE);
  return res.data;
}

export async function createSport(payload) {
  const res = await api.post(BASE, payload, true);
  return res.data;
}

export async function updateSport(id, payload) {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteSport(id) {
  return api.del(`${BASE}/${id}`);
}

export async function changeSportStatus(id, status) {
  const res = await api.patch(`${BASE}/${id}/status`, { status });
  return res.data;
}
