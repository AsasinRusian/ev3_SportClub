import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";
import { logout, getUser } from "../services/authService";
import logo from "../assets/logo.png";

/*
 * Cabecera común de los dashboards.
 * Incluye, según pide la pauta: Logo, "Mi Perfil" y "Cerrar Sesión".
 * Los enlaces de navegación se reciben por props (coherentes con el rol).
 *
 * props:
 *  - roleLabel: texto que acompaña al logo (ej. "Panel Usuario")
 *  - basePath:  prefijo de rutas del rol (ej. "/user")
 *  - links:     [{ to, label }] para la navegación
 */
function DashboardHeader({ roleLabel, basePath, links = [] }) {
  const navigate = useNavigate();
  const user = getUser();
  const initials = (user?.full_name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Volverás a la pantalla de inicio de sesión.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6a2fb5",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to={`${basePath}/dashboard`} className="brand">
          <img src={logo} alt="SportClub" />
          <span className="brand-role">{roleLabel}</span>
        </Link>

        <nav className="app-nav" aria-label="Navegación principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Dropdown align="end" className="account-menu">
          <Dropdown.Toggle id="account-dropdown">
            <span className="account-avatar">{initials}</span>
            <span className="d-none d-md-inline">{user?.full_name}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>{user?.email}</Dropdown.Header>
            <Dropdown.Item as={Link} to={`${basePath}/perfil`}>
              Mi Perfil
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}

export default DashboardHeader;
