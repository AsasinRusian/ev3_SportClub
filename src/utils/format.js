/*
 * format.js — Utilidades de formato de datos para la interfaz.
 */

// Convierte una fecha (ISO o Date) a formato dd/mm/yyyy
export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Convierte una fecha al formato largo en español: "15 de Julio de 2026"
export function formatDateLong(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

// Capitaliza cada palabra de un nombre
export function capitalizeName(name) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Devuelve las iniciales (máx. 2) de un nombre
export function initialsOf(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}