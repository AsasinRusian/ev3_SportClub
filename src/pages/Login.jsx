import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  loginUser,
  saveSession,
  dashboardPathForRole,
} from "../services/authService";
import { validateEmail, validateRequired, isFormValid } from "../utils/validators";
import logo from "../assets/logo.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    // VALIDACIÓN FRONTEND
    const next = {
      email: validateEmail(form.email),
      password: validateRequired(form.password, "La contraseña"),
    };
    setErrors(next);
    if (!isFormValid(next)) return;

    setLoading(true);
    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      saveSession(data.data.token, data.data.user);

      await Swal.fire({
        title: `¡Bienvenido, ${data.data.user.full_name}!`,
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate(dashboardPathForRole(data.data.user.role), { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-head">
          <img src={logo} alt="SportClub" />
          <h1>Bienvenido</h1>
        </div>

        {apiError && <div className="login-alert">{apiError}</div>}

        <div className={`login-field${errors.email ? " invalid" : ""}`}>
          <label>Correo</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nombre@correo.com"
          />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>

        <div className={`login-field${errors.password ? " invalid" : ""}`}>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
          />
          {errors.password && <span className="err">{errors.password}</span>}
        </div>

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <div className="login-links">
          <Link to="/register">¿No tienes cuenta? <strong>Regístrate</strong></Link>
          <Link to="/">Inicio</Link>
        </div>

        <div className="login-demo">
          <strong>Cuentas de prueba (backend):</strong><br />
          admin1@demo.cl · coach1@demo.cl · user1@demo.cl<br />
          Contraseña para todas: 12345678
        </div>
      </form>
    </div>
  );
}

export default Login;
