import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  registerUser,
  saveSession,
  dashboardPathForRole,
} from "../services/authService";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
  validateRequired,
  isFormValid,
} from "../utils/validators";
import logo from "../assets/logo.png";
import "../styles/register.css";

const INITIAL = {
  full_name: "",
  birthdate: "",
  phone: "",
  experience_level: "Principiante",
  document_type: "Cédula",
  document_number: "",
  email: "",
  password: "",
  confirm: "",
  terms: false,
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // VALIDACIÓN FRONTEND de todos los campos
  const runValidation = () => {
    const next = {
      full_name: validateFullName(form.full_name),
      phone: validatePhone(form.phone),
      document_type: validateRequired(form.document_type, "El tipo de documento"),
      document_number: validateRequired(form.document_number, "El número de documento"),
      email: validateEmail(form.email),
      password: validatePassword(form.password, { min: 8 }),
      confirm: form.confirm !== form.password ? "Las contraseñas no coinciden." : "",
      terms: form.terms ? "" : "Debes aceptar los términos y condiciones.",
    };
    setErrors(next);
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const next = runValidation();
    if (!isFormValid(next)) return;

    setLoading(true);
    try {
      // Se envían los datos del registro al backend.
      // Si el backend de la asignatura solo acepta full_name/email/password,
      // ignorará los campos extra sin problema.
      const data = await registerUser({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        birthdate: form.birthdate,
        experience_level: form.experience_level,
        document_type: form.document_type,
        document_number: form.document_number.trim(),
      });

      saveSession(data.data.token, data.data.user);

      await Swal.fire({
        title: "¡Cuenta creada!",
        text: "Tu registro se completó correctamente.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(dashboardPathForRole(data.data.user.role), { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cls = (field) => `reg-field${errors[field] ? " invalid" : ""}`;

  return (
    <div className="register">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        {/* Encabezado */}
        <div className="register-head">
          <img src={logo} alt="SportClub" />
          <h1>Crear Cuenta</h1>
          <p>Únete a la comunidad SportClub</p>
        </div>

        {apiError && <div className="reg-alert">{apiError}</div>}

        {/* INFORMACIÓN PERSONAL */}
        <div className="reg-section"><span>Información Personal</span></div>

        <div className="reg-grid">
          <div className={cls("full_name")}>
            <label>Nombre completo <span className="req">*</span></label>
            <input
              type="text"
              name="full_name"
              placeholder="Ej: Kathalyna Higuera"
              value={form.full_name}
              onChange={handleChange}
            />
            {errors.full_name && <span className="err">{errors.full_name}</span>}
          </div>

          <div className="reg-field">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
            />
          </div>

          <div className={cls("phone")}>
            <label>Número telefónico <span className="req">*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="+56 9 1234 5678"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="err">{errors.phone}</span>}
          </div>

          <div className="reg-field">
            <label>Nivel de experiencia ejercitando</label>
            <select name="experience_level" value={form.experience_level} onChange={handleChange}>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className={cls("document_type")}>
            <label>Tipo de documento <span className="req">*</span></label>
            <select name="document_type" value={form.document_type} onChange={handleChange}>
              <option value="Cédula">Cédula</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="DNI">DNI</option>
            </select>
            {errors.document_type && <span className="err">{errors.document_type}</span>}
          </div>

          <div className={cls("document_number")}>
            <label>Número de documento <span className="req">*</span></label>
            <input
              type="text"
              name="document_number"
              placeholder="12.345.678-9"
              value={form.document_number}
              onChange={handleChange}
            />
            {errors.document_number && <span className="err">{errors.document_number}</span>}
          </div>
        </div>

        {/* CREDENCIALES DE ACCESO */}
        <div className="reg-section"><span>Credenciales de Acceso</span></div>

        <div className="reg-grid">
          <div className={`${cls("email")} full`}>
            <label>Correo electrónico <span className="req">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="nombre@correo.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="err">{errors.email}</span>}
          </div>

          <div className={cls("password")}>
            <label>Contraseña <span className="req">*</span></label>
            <input
              type="password"
              name="password"
              placeholder="Mín. 8 caracteres"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="err">{errors.password}</span>}
          </div>

          <div className={cls("confirm")}>
            <label>Confirmar contraseña <span className="req">*</span></label>
            <input
              type="password"
              name="confirm"
              placeholder="Repite tu contraseña"
              value={form.confirm}
              onChange={handleChange}
            />
            {errors.confirm && <span className="err">{errors.confirm}</span>}
          </div>
        </div>

        {/* Términos */}
        <label className="reg-terms">
          <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
          <span>
            Acepto los Términos y Condiciones y la Política de Privacidad.
            {errors.terms && <span className="err">{errors.terms}</span>}
          </span>
        </label>

        <button type="submit" className="reg-submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>

        <p className="reg-foot">
          ¿Ya tienes cuenta? <Link to="/login">→ Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
