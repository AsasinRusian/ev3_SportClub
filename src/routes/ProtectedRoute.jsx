import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

/*
 * ProtectedRoute: impide el acceso a páginas privadas si no hay sesión.
 * children = componente o layout que queremos proteger.
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
