import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";


const EMPTY = { name: "", objective: "", duration: "", status: true };

function SportFormModal({ show, mode = "create", initial = null, onClose, onSubmit }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setErrors({});
      if (isEdit && initial) {
        setForm({
          name: initial.name || "",
          objective: initial.objective || "",
          duration: initial.duration ?? "",
          status: initial.status ?? true,
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
    const next = {};
    if (!form.name || form.name.trim().length < 3) {
      next.name = "El nombre es obligatorio (mínimo 3 caracteres).";
    }
    if (!form.objective || form.objective.trim().length < 5) {
      next.objective = "El objetivo es obligatorio (mínimo 5 caracteres).";
    }
    const duration = Number(form.duration);
    if (!form.duration || Number.isNaN(duration) || duration < 1) {
      next.duration = "La duración debe ser un número mayor a 0.";
    }
    setErrors(next);
    return next;
  };

  const handleSave = async () => {
    const next = runValidation();
    if (Object.keys(next).length > 0) return;

    const payload = {
      name: form.name.trim(),
      objective: form.objective.trim(),
      duration: Number(form.duration),
      status: form.status,
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      setErrors((prev) => ({ ...prev, api: error.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Editar deporte" : "Nuevo deporte"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errors.api && <div className="alert alert-danger py-2">{errors.api}</div>}

        <Form noValidate>
          <Form.Group className="mb-3" controlId="sportName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Ej: Natación"
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="sportObjective">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="objective"
              value={form.objective}
              onChange={handleChange}
              isInvalid={!!errors.objective}
              placeholder="Ej: Mejorar resistencia física y técnica respiratoria."
            />
            <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="sportDuration">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              isInvalid={!!errors.duration}
              placeholder="Ej: 60"
            />
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
          </Form.Group>

          <Form.Check
            type="switch"
            id="sportStatus"
            name="status"
            label={form.status ? "Activo" : "Inactivo"}
            checked={form.status}
            onChange={handleChange}
          />
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
            "Crear deporte"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SportFormModal;