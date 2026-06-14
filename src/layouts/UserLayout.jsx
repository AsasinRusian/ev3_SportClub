import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/layout.css";

function UserLayout() {
  const links = [
    { to: "/user/dashboard", label: "Inicio", end: true },
    { to: "/user/perfil", label: "Mi Perfil" },
  ];

  return (
    <div className="app-shell theme-user">
      <DashboardHeader roleLabel="Panel Usuario" basePath="/user" links={links} />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        SportClub © {new Date().getFullYear()} — Área de socios
      </footer>
    </div>
  );
}

export default UserLayout;
