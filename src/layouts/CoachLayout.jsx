import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/layout.css";

function CoachLayout() {
  const links = [
    { to: "/coach/dashboard", label: "Inicio", end: true },
    { to: "/coach/perfil", label: "Mi Perfil" },
  ];

  return (
    <div className="app-shell theme-coach">
      <DashboardHeader roleLabel="Panel Coach" basePath="/coach" links={links} />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        SportClub © {new Date().getFullYear()} — Área de entrenadores
      </footer>
    </div>
  );
}

export default CoachLayout;
