import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../services/authService";

/*
 * RoleRoute: valida que el usuario tenga uno de los roles permitidos.
 * - Sin sesión -> /login
 * - Rol no permitido -> /unauthorized
 *
 * Nota de seguridad: esta validación mejora la experiencia, pero la
 * protección real está en el backend (middleware authorize). Aunque
 * alguien fuerce la navegación en el cliente, la API rechaza la petición.
 */
function RoleRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;
