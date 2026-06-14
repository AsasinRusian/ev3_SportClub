import { useState } from "react";
import Swal from "sweetalert2";

import { getUser, updateProfile, changePassword } from "../services/authService";
import { validateFullName, validatePassword, validateRequired, isFormValid } from "../utils/validators";
import { formatDate, capitalizeName, initialsOf } from "../utils/format";
import "../styles/profile.css";

const ROLE_LABELS = { user: "Usuario", coach: "Coach", admin: "Administrador" };

function Profile() {
  const [user, setUser] = useState(getUser());

  // ----- Edición de datos personales -----
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [pForm, setPForm] = useState({
    full_name: user?.full_name || "",
    birthdate: user?.birthdate || "",
    favorite_sport: user?.favorite_sport || "",
    metadata: user?.metadata || "",
  });
  const [pErrors, setPErrors] = useState({});

  // ----- Cambio de contraseña -----
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const startEdit = () => {
    setPForm({
      full_name: user?.full_name || "",
      birthdate: user?.birthdate || "",
      favorite_sport: user?.favorite_sport || "",
      metadata: user?.metadata || "",
    });
    setPErrors({});
    setEditing(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setPForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const next = { full_name: validateFullName(pForm.full_name) };
    setPErrors(next);
    if (!isFormValid(next)) return;

    setSavingProfile(true);
    try {
      const res = await updateProfile({
        full_name: pForm.full_name.trim(),
        birthdate: pForm.birthdate,
        favorite_sport: pForm.favorite_sport.trim(),
        metadata: pForm.metadata.trim(),
      });
      if (res?.data?.user) setUser(res.data.user);
      setEditing(false);
      Swal.fire({ icon: "success", title: "Perfil actualizado correctamente", timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const next = {
      current_password: validateRequired(pwForm.current_password, "La contraseña actual"),
      new_password: validatePassword(pwForm.new_password, { min: 8 }),
      confirm_password:
        pwForm.confirm_password !== pwForm.new_password ? "Las contraseñas no coinciden." : "",
    };
    setPwErrors(next);
    if (!isFormValid(next)) return;

    setSavingPw(true);
    try {
      await changePassword({
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
      Swal.fire({ icon: "success", title: "Contraseña actualizada correctamente", timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setSavingPw(false);
    }
  };

  const pcls = (f) => `pfield${pErrors[f] ? " invalid" : ""}`;
  const wcls = (f) => `pfield${pwErrors[f] ? " invalid" : ""}`;

  return (
    <>
      {/* Cabecera del módulo */}
      <div className="profile-top">
        <div className="page-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Mi cuenta</span>
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y preferencias de cuenta.</p>
        </div>
        {!editing && (
          <button className="btn-edit" onClick={startEdit}>✎ Editar Perfil</button>
        )}
      </div>

      <div className="profile-layout">
        {/* ---- Resumen (izquierda) ---- */}
        <aside className="pcard summary-card">
          <div className="summary-avatar">{initialsOf(user?.full_name)}</div>
          <h2 className="summary-name">{capitalizeName(user?.full_name)}</h2>
          <span className={`role-badge role-${user?.role}`}>{ROLE_LABELS[user?.role] || user?.role}</span>

          <div className="summary-divider" />

          <div className="summary-list">
            <div className="summary-item">
              <span className="si-icon">✉</span>
              <div>
                <div className="si-label">Email</div>
                <div className="si-value">{user?.email?.toLowerCase()}</div>
              </div>
            </div>
            <div className="summary-item">
              <span className="si-icon">🎂</span>
              <div>
                <div className="si-label">Fecha de nacimiento</div>
                <div className="si-value">{user?.birthdate ? formatDate(user.birthdate) : "No registrada"}</div>
              </div>
            </div>
            <div className="summary-item">
              <span className="si-icon">🏷️</span>
              <div>
                <div className="si-label">Rol</div>
                <div className="si-value">
                  <span className={`role-badge role-${user?.role}`}>{ROLE_LABELS[user?.role] || user?.role}</span>
                </div>
              </div>
            </div>
            <div className="summary-item">
              <span className="si-icon">📅</span>
              <div>
                <div className="si-label">Fecha de registro</div>
                <div className="si-value">{user?.created_at ? formatDate(user.created_at) : "—"}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---- Formularios (derecha) ---- */}
        <div>
          {/* Datos personales */}
          <section className="pcard section-card">
            <div className="sc-head">
              <h3>Información Personal</h3>
              <p>Tu correo y rol no se pueden modificar.</p>
            </div>

            <form onSubmit={saveProfile} noValidate>
              <div className="form-grid">
                <div className={pcls("full_name")}>
                  <label>Nombre completo <span className="req">*</span></label>
                  <input
                    type="text"
                    name="full_name"
                    value={editing ? pForm.full_name : capitalizeName(user?.full_name)}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                  {pErrors.full_name && <span className="err">{pErrors.full_name}</span>}
                </div>

                <div className="pfield">
                  <label>Email</label>
                  <input type="email" value={user?.email?.toLowerCase() || ""} disabled />
                  <span className="hint">El correo no se puede cambiar.</span>
                </div>

                <div className="pfield">
                  <label>Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={editing ? pForm.birthdate : (user?.birthdate || "")}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                </div>

                <div className="pfield">
                  <label>Deporte favorito</label>
                  <input
                    type="text"
                    name="favorite_sport"
                    placeholder="Ej: Fútbol"
                    value={editing ? pForm.favorite_sport : (user?.favorite_sport || "")}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                </div>

                <div className="pfield full">
                  <label>Otros / Metadata <span style={{ color: "var(--muted)", fontWeight: 400 }}>(intereses, habilidades, etc.)</span></label>
                  <textarea
                    name="metadata"
                    placeholder="Cuéntanos algo sobre ti..."
                    value={editing ? pForm.metadata : (user?.metadata || "")}
                    onChange={handleProfileChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              {editing && (
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
                  <button type="submit" className="btn-save" disabled={savingProfile}>
                    {savingProfile ? "Guardando..." : "✓ Guardar cambios"}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Seguridad: cambio de contraseña */}
          <section className="pcard section-card" style={{ marginBottom: 0 }}>
            <div className="sc-head">
              <h3>Cambiar Contraseña</h3>
              <p>Actualiza tu contraseña de acceso.</p>
            </div>

            <form onSubmit={savePassword} noValidate>
              <div className="form-grid">
                <div className={`${wcls("current_password")} full`}>
                  <label>Contraseña actual <span className="req">*</span></label>
                  <input
                    type="password"
                    name="current_password"
                    placeholder="Ingresa tu contraseña actual"
                    value={pwForm.current_password}
                    onChange={handlePwChange}
                  />
                  {pwErrors.current_password && <span className="err">{pwErrors.current_password}</span>}
                </div>

                <div className={wcls("new_password")}>
                  <label>Nueva contraseña <span className="req">*</span></label>
                  <input
                    type="password"
                    name="new_password"
                    placeholder="Mínimo 8 caracteres"
                    value={pwForm.new_password}
                    onChange={handlePwChange}
                  />
                  {pwErrors.new_password && <span className="err">{pwErrors.new_password}</span>}
                </div>

                <div className={wcls("confirm_password")}>
                  <label>Confirmar nueva contraseña <span className="req">*</span></label>
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="Repite tu nueva contraseña"
                    value={pwForm.confirm_password}
                    onChange={handlePwChange}
                  />
                  {pwErrors.confirm_password && <span className="err">{pwErrors.confirm_password}</span>}
                </div>
              </div>

              <div className="info-note">
                La contraseña debe tener al menos 8 caracteres.
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-pass" disabled={savingPw}>
                  {savingPw ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default Profile;
