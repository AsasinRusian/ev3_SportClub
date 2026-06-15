import { useEffect, useMemo, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import SportFormModal from "../../components/SportFormModal";
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  changeSportStatus,
} from "../../services/sportService";
import { formatDateLong } from "../../utils/format";
import "../../styles/userManagement.css";
import "../../styles/sportManagement.css";

function SportManagement() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [modal, setModal] = useState({ show: false, mode: "create", target: null });

  // Carga / refresca el listado desde la API
  const loadSports = async () => {
    setLoading(true);
    try {
      const data = await getSports();
      setSports(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sports;
    return sports.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.objective.toLowerCase().includes(q)
    );
  }, [sports, search]);

  const openCreate = () => setModal({ show: true, mode: "create", target: null });
  const openEdit = (sport) => setModal({ show: true, mode: "edit", target: sport });
  const closeModal = () => setModal((m) => ({ ...m, show: false }));

  // Crear / editar con actualización dinámica del listado
  const handleSubmit = async (payload) => {
    if (modal.mode === "create") {
      const created = await createSport(payload);
      setSports((prev) => [created, ...prev]);
      closeModal();
      Swal.fire({ icon: "success", title: "Deporte creado", timer: 1300, showConfirmButton: false });
    } else {
      const updated = await updateSport(modal.target.id, payload);
      setSports((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      closeModal();
      Swal.fire({ icon: "success", title: "Deporte actualizado", timer: 1300, showConfirmButton: false });
    }
  };

  // Eliminar con confirmación SweetAlert2
  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar este deporte?",
      html: `Se eliminará <strong>${sport.name}</strong>. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteSport(sport.id);
      setSports((prev) => prev.filter((s) => s.id !== sport.id));
      Swal.fire({ icon: "success", title: "Deporte eliminado", timer: 1300, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Cambio de estado con Switch (PATCH) y actualización inmediata
  const handleToggleStatus = async (sport) => {
    setTogglingId(sport.id);
    try {
      const updated = await changeSportStatus(sport.id, !sport.status);
      setSports((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Administración</span>
        <h1>Gestión de Deportes</h1>
        <p>Administra los deportes ofrecidos por el club.</p>
      </div>

      {/* Barra de acciones */}
      <div className="um-toolbar sport-toolbar">
        <input
          type="text"
          className="form-control um-search"
          placeholder="Buscar por nombre u objetivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-refresh" onClick={loadSports} disabled={loading}>
          ⟳ Refrescar
        </button>
        <button className="btn-new" onClick={openCreate}>
          <span className="btn-icon">＋</span> Nuevo Deporte
        </button>
      </div>

      {/* Tabla de deportes */}
      <div className="um-table-card">
        <div className="um-table-title">Lista de Deportes</div>
        {loading ? (
          <div className="um-empty"><Spinner animation="border" size="sm" /> Cargando deportes...</div>
        ) : filtered.length === 0 ? (
          <div className="um-empty">No se encontraron deportes.</div>
        ) : (
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="sport-name">{s.name}</td>
                    <td className="sport-objective">{s.objective}</td>
                    <td>{s.duration} min</td>
                    <td>
                      <div className="status-switch">
                        <Form.Check
                          type="switch"
                          id={`status-${s.id}`}
                          checked={!!s.status}
                          disabled={togglingId === s.id}
                          onChange={() => handleToggleStatus(s)}
                          label={s.status ? "Activo" : "Inactivo"}
                        />
                      </div>
                    </td>
                    <td>{formatDateLong(s.created_at)}</td>
                    <td>
                      <div className="um-actions">
                        <button
                          className="icon-btn edit"
                          title="Editar deporte"
                          aria-label="Editar deporte"
                          onClick={() => openEdit(s)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn delete"
                          title="Eliminar deporte"
                          aria-label="Eliminar deporte"
                          onClick={() => handleDelete(s)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SportFormModal
        show={modal.show}
        mode={modal.mode}
        initial={modal.target}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default SportManagement;
