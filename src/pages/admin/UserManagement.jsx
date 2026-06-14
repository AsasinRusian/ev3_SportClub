import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import UserFormModal from "../../components/UserFormModal";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { getUser } from "../../services/authService";
import { formatDate, initialsOf } from "../../utils/format";
import "../../styles/userManagement.css";

const ROLE_LABELS = { user: "Usuario", coach: "Coach", admin: "Administrador" };

function UserManagement() {
  const currentUser = getUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ show: false, mode: "create", target: null });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const openCreate = () => setModal({ show: true, mode: "create", target: null });
  const openEdit = (user) => setModal({ show: true, mode: "edit", target: user });
  const closeModal = () => setModal((m) => ({ ...m, show: false }));

  const handleSubmit = async (payload) => {
    if (modal.mode === "create") {
      const created = await createUser(payload);
      setUsers((prev) => [created, ...prev]);
      closeModal();
      Swal.fire({ icon: "success", title: "Usuario creado", timer: 1300, showConfirmButton: false });
    } else {
      const updated = await updateUser(modal.target.id, payload);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      closeModal();
      Swal.fire({ icon: "success", title: "Usuario actualizado", timer: 1300, showConfirmButton: false });
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      Swal.fire("Acción no permitida", "No puedes eliminar tu propia cuenta.", "warning");
      return;
    }
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      html: `Se eliminará a <strong>${user.full_name}</strong>. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      Swal.fire({ icon: "success", title: "Usuario eliminado", timer: 1300, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <>
      {/* Título y descripción del módulo */}
      <div className="page-head">
        <span className="eyebrow">Administración</span>
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema.</p>
      </div>

      {/* Barra superior con búsqueda y botón Nuevo Usuario */}
      <div className="um-toolbar">
        <input
          type="text"
          className="form-control um-search"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-new" onClick={openCreate}>
          <span className="btn-icon">＋</span> Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="um-table-card">
        <div className="um-table-title">Lista de Usuarios</div>
        {loading ? (
          <div className="um-empty">Cargando usuarios...</div>
        ) : filtered.length === 0 ? (
          <div className="um-empty">No se encontraron usuarios.</div>
        ) : (
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de registro</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="um-id">{u.id}</td>
                    <td>
                      <div className="um-user">
                        <span className="um-avatar">{initialsOf(u.full_name)}</span>
                        <span className="um-name">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="um-email-cell">{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <div className="um-actions">
                        <button
                          className="icon-btn edit"
                          title="Editar usuario"
                          aria-label="Editar usuario"
                          onClick={() => openEdit(u)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn delete"
                          title="Eliminar usuario"
                          aria-label="Eliminar usuario"
                          onClick={() => handleDelete(u)}
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

      <UserFormModal
        show={modal.show}
        mode={modal.mode}
        initial={modal.target}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default UserManagement;
