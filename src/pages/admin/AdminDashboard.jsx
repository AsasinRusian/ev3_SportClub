import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../services/authService";
import { getUsers } from "../../services/userService";
import "../../styles/dashboard.css";
import "../../styles/adminDashboard.css";

function AdminDashboard() {
  const user = getUser();
  const firstName = user?.full_name?.split(" ")[0] || "Admin";

  const [counts, setCounts] = useState({ total: 0, user: 0, coach: 0, admin: 0 });

  // Carga real de usuarios para mostrar métricas del sistema.
  useEffect(() => {
    getUsers()
      .then((users) => {
        setCounts({
          total: users.length,
          user: users.filter((u) => u.role === "user").length,
          coach: users.filter((u) => u.role === "coach").length,
          admin: users.filter((u) => u.role === "admin").length,
        });
      })
      .catch(() => {
        // Si falla la carga, se mantienen los contadores en cero.
      });
  }, []);

  return (
    <>
      <div className="welcome-banner admin">
        <h2>Panel de administración</h2>
        <p>Hola {firstName}, este es el estado general del sistema SportClub.</p>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Usuarios totales</div>
          <div className="stat-value">{counts.total}</div>
          <div className="stat-foot">Registrados en el sistema</div>
        </div>
        <div className="stat">
          <div className="stat-label">Socios</div>
          <div className="stat-value">{counts.user}</div>
          <div className="stat-foot">Rol usuario</div>
        </div>
        <div className="stat">
          <div className="stat-label">Entrenadores</div>
          <div className="stat-value">{counts.coach}</div>
          <div className="stat-foot">Rol coach</div>
        </div>
        <div className="stat">
          <div className="stat-label">Administradores</div>
          <div className="stat-value">{counts.admin}</div>
          <div className="stat-foot">Rol admin</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Accesos rápidos</h3>
        </div>
        <div className="panel-body">
          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <Link to="/admin/usuarios" className="admin-shortcut">
              <span className="sc-icon">👥</span>
              <div>
                <div className="row-main">Gestión de Usuarios</div>
                <div className="row-sub">Crear, editar y eliminar usuarios</div>
              </div>
            </Link>
            <Link to="/admin/perfil" className="admin-shortcut">
              <span className="sc-icon">⚙️</span>
              <div>
                <div className="row-main">Mi Perfil</div>
                <div className="row-sub">Datos de tu cuenta de administrador</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
