/*
 * validators.js — Validaciones de formulario en el FRONTEND.
 * Dan feedback inmediato al usuario antes de llamar al backend.
 * (El backend vuelve a validar todo; el frontend no es la única defensa.)
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || !email.trim()) return "El correo es obligatorio.";
  if (!EMAIL_REGEX.test(email.trim())) return "Ingrese un correo válido.";
  return "";
}

export function validatePassword(password, { min = 6 } = {}) {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < min) return `La contraseña debe tener al menos ${min} caracteres.`;
  return "";
}

export function validateStrongPassword(password) {
  const base = validatePassword(password);
  if (base) return base;
  if (!/[A-Za-z]/.test(password)) return "La contraseña debe incluir al menos una letra.";
  if (!/[0-9]/.test(password)) return "La contraseña debe incluir al menos un número.";
  return "";
}

export function validateFullName(name) {
  if (!name || !name.trim()) return "El nombre es obligatorio.";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
  return "";
}

export function validateRequired(value, label = "Este campo") {
  if (!value || !String(value).trim()) return `${label} es obligatorio.`;
  return "";
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) return "El número telefónico es obligatorio.";
  // Acepta dígitos, espacios y los símbolos + ( ) - ; mínimo 8 dígitos
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return "Ingrese un número telefónico válido.";
  return "";
}

// Devuelve true si el objeto de errores no tiene mensajes
export function isFormValid(errors) {
  return Object.values(errors).every((msg) => !msg);
}
