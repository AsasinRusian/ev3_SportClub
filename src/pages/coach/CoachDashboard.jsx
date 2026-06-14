import { getUser } from "../../services/authService";
import "../../styles/dashboard.css";
import "../../styles/coachDashboard.css";

function CoachDashboard() {
  const user = getUser();
  const firstName = user?.full_name?.split(" ")[0] || "Coach";

  const todayClasses = [
    { id: 1, clase: "Spinning", hora: "08:00", inscritos: 14 },
    { id: 2, clase: "Funcional", hora: "12:00", inscritos: 9 },
    { id: 3, clase: "CrossFit", hora: "19:00", inscritos: 11 },
  ];

  const students = [
    { id: 1, nombre: "Camila Rojas", plan: "Mensual" },
    { id: 2, nombre: "Diego Soto", plan: "Trimestral" },
    { id: 3, nombre: "Valentina Pérez", plan: "Mensual" },
    { id: 4, nombre: "Matías Fuentes", plan: "Anual" },
  ];

  return (
    <>
      <div className="welcome-banner coach">
        <h2>Buen día, {firstName} 🏋️</h2>
        <p>Resumen de tus clases de hoy y tus alumnos inscritos.</p>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Clases hoy</div>
          <div className="stat-value">3</div>
          <div className="stat-foot">Próxima: 08:00 Spinning</div>
        </div>
        <div className="stat">
          <div className="stat-label">Alumnos activos</div>
          <div className="stat-value">34</div>
          <div className="stat-foot">+3 esta semana</div>
        </div>
        <div className="stat">
          <div className="stat-label">Asistencia promedio</div>
          <div className="stat-value">87%</div>
          <div className="stat-foot">Últimos 30 días</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Clases de hoy</h3>
            <span className="pill">{todayClasses.length} sesiones</span>
          </div>
          <div className="panel-body">
            <ul className="list-rows">
              {todayClasses.map((c) => (
                <li key={c.id}>
                  <div>
                    <div className="row-main">{c.clase}</div>
                    <div className="row-sub">Hora {c.hora}</div>
                  </div>
                  <span className="pill">{c.inscritos} inscritos</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Mis alumnos</h3>
          </div>
          <div className="panel-body">
            <ul className="list-rows">
              {students.map((s) => (
                <li key={s.id}>
                  <div className="row-main">{s.nombre}</div>
                  <span className="row-sub">{s.plan}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default CoachDashboard;
