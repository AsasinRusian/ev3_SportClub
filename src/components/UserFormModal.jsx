import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  isFormValid,
} from "../utils/validators";


const EMPTY = { full_name: "", email: "", password: "", confirm: "", role: "user", active: true };

function UserFormModal({ show, mode = "create", initial = null, onClose, onSubmit }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setErrors({});
      if (isEdit && initial) {
        setForm({
          full_name: initial.full_name || "",
          email: initial.email || "",
          password: "",
          confirm: "",
          role: initial.role || "user",
          active: initial.active ?? true,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [show, isEdit, initial]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const runValidation = () => {
    const passwordError =
      isEdit && !form.password ? "" : validatePassword(form.password);
    const nextErrors = {
      full_name: validateFullName(form.full_name),
      email: validateEmail(form.email),

      password: passwordError,

      confirm:
        (form.password || !isEdit) && form.confirm !== form.password
          ? "Las contraseñas no coinciden."
          : "",
      role: ["user", "coach", "admin"].includes(form.role) ? "" : "Rol no válido.",
    };
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSave = async () => {
    const nextErrors = runValidation();
    if (!isFormValid(nextErrors)) return;

    // Construye el payload; en edición omite la contraseña si quedó vacía
    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      role: form.role,
      active: form.active,
    };
    if (form.password) payload.password = form.password;

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      // Muestra el error del backend asociado al formulario
      setErrors((prev) => ({ ...prev, api: error.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Editar usuario" : "Crear usuario"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errors.api && <div className="alert alert-danger py-2">{errors.api}</div>}

        <Form noValidate>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              isInvalid={!!errors.full_name}
              placeholder="Ej: Camila Rojas"
            />
            <Form.Control.Feedback type="invalid">
              {errors.full_name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="correo@ejemplo.cl"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>
              Contraseña{" "}
              {isEdit && (
                <small className="text-muted">(dejar vacía para no cambiarla)</small>
              )}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              placeholder={isEdit ? "••••••" : "Mínimo 6 caracteres"}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirm">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              isInvalid={!!errors.confirm}
              placeholder={isEdit ? "••••••" : "Repite la contraseña"}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirm}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="role"
              value={form.role}
              onChange={handleChange}
              isInvalid={!!errors.role}
            >
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>

          {isEdit && (
            <Form.Check
              type="switch"
              id="formActive"
              name="active"
              label="Cuenta activa"
              checked={form.active}
              onChange={handleChange}
            />
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button className="btn-role" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" animation="border" /> Guardando...
            </>
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            "Crear usuario"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserFormModal;
