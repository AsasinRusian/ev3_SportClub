import { Link } from "react-router-dom";
import { Alert, Button, Container } from "react-bootstrap";
import { isAuthenticated, getUser, dashboardPathForRole } from "../services/authService";

function Unauthorized() {
  const logged = isAuthenticated();
  const user = getUser();
  const backTo = logged ? dashboardPathForRole(user?.role) : "/login";

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Alert variant="danger" className="text-center shadow-sm" style={{ maxWidth: "460px" }}>
        <Alert.Heading>Acceso no autorizado</Alert.Heading>
        <p className="mb-3">
          No tienes permisos para acceder a esta sección con tu rol actual.
        </p>
        <Link to={backTo}>
          <Button variant="danger">
            {logged ? "Volver a mi panel" : "Ir al inicio de sesión"}
          </Button>
        </Link>
      </Alert>
    </Container>
  );
}

export default Unauthorized;
