import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/layout.css";

function AdminLayout() {
  const links = [
    { to: "/admin/dashboard", label: "Inicio", end: true },
    { to: "/admin/usuarios", label: "Gestión de Usuarios" },
    { to: "/admin/deportes", label: "Gestión de Deportes" },
    { to: "/admin/perfil", label: "Mi Perfil" },
  ];

  return (
    <div className="app-shell theme-admin">
      <DashboardHeader roleLabel="Panel Administrador" basePath="/admin" links={links} />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        SportClub © {new Date().getFullYear()} — Administración del sistema
      </footer>
    </div>
  );
}

export default AdminLayout;
