import { getUser } from "../../services/authService";
import "../../styles/dashboard.css";
import "../../styles/userDashboard.css";

function UserDashboard() {
  const user = getUser();
  const firstName = user?.full_name?.split(" ")[0] || "Socio";

  // Datos de ejemplo para mostrar la estructura de la interfaz.
  const reservations = [
    { id: 1, clase: "Spinning", fecha: "Lun 16 jun · 08:00", coach: "Coach Demo" },
    { id: 2, clase: "Funcional", fecha: "Mié 18 jun · 19:00", coach: "Coach Ana" },
    { id: 3, clase: "Yoga", fecha: "Vie 20 jun · 10:30", coach: "Coach Luis" },
  ];

  const availableClasses = [
    { id: 1, clase: "CrossFit", cupos: 4 },
    { id: 2, clase: "Zumba", cupos: 9 },
    { id: 3, clase: "Natación", cupos: 2 },
  ];

  return (
    <>
      <div className="welcome-banner user">
        <h2>Hola, {firstName} 👋</h2>
        <p>Estas son tus próximas reservas y las clases disponibles esta semana.</p>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Reservas activas</div>
          <div className="stat-value">3</div>
          <div className="stat-foot">Próxima: lunes 08:00</div>
        </div>
        <div className="stat">
          <div className="stat-label">Clases este mes</div>
          <div className="stat-value">12</div>
          <div className="stat-foot">+4 respecto al mes anterior</div>
        </div>
        <div className="stat">
          <div className="stat-label">Membresía</div>
          <div className="stat-value">Activa</div>
          <div className="stat-foot">Vence el 30 jun</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Mis próximas reservas</h3>
            <span className="pill">{reservations.length} reservas</span>
          </div>
          <div className="panel-body">
            <ul className="list-rows">
              {reservations.map((r) => (
                <li key={r.id}>
                  <div>
                    <div className="row-main">{r.clase}</div>
                    <div className="row-sub">{r.fecha} · {r.coach}</div>
                  </div>
                  <span className="pill">Confirmada</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Clases disponibles</h3>
          </div>
          <div className="panel-body">
            <ul className="list-rows">
              {availableClasses.map((c) => (
                <li key={c.id}>
                  <div className="row-main">{c.clase}</div>
                  <span className="row-sub">{c.cupos} cupos</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
