#!/usr/bin/env bash
#
# git-setup.sh — Inicializa el repositorio Git del proyecto SportClub
# con ramas por funcionalidad (branch) y commits claros y progresivos.
#
# CÓMO USARLO (en Git Bash, dentro de la carpeta del proyecto):
#   1. Asegúrate de tener configurado tu nombre y correo de Git:
#        git config --global user.name "Tu Nombre"
#        git config --global user.email "tucorreo@ejemplo.com"
#   2. Ejecuta:
#        bash git-setup.sh
#   3. Luego conéctalo a GitHub (ver GUIA_GITHUB.md) y haz push.
#
set -e

# --- Validaciones previas ---
if [ ! -f package.json ]; then
  echo "ERROR: ejecuta este script desde la carpeta del proyecto (donde está package.json)."
  exit 1
fi

if [ -d .git ]; then
  echo "ERROR: ya existe un repositorio Git en esta carpeta (.git)."
  echo "Si quieres empezar de cero, elimina la carpeta .git y vuelve a ejecutar."
  exit 1
fi

if ! git config user.name >/dev/null 2>&1; then
  echo "Aviso: no tienes configurado tu nombre de Git. Configurando uno temporal."
  echo "       Cámbialo con: git config --global user.name \"Tu Nombre\""
  git config --global user.name "Estudiante SportClub" || true
  git config --global user.email "estudiante@sportclub.cl" || true
fi

# Función para commit en una rama de funcionalidad y fusión a main
feature() {
  local branch="$1"; shift
  local message="$1"; shift
  git checkout -b "$branch" >/dev/null
  git add "$@"
  git commit -m "$message" >/dev/null
  git checkout main >/dev/null
  git merge --no-ff "$branch" -m "Merge $branch" >/dev/null
  echo "  ✓ $branch  →  main"
}

echo "Inicializando repositorio..."
git init -q
git checkout -b main >/dev/null 2>&1 || git branch -M main

# --- 1. Commit inicial: estructura base ---
git add package.json vite.config.js index.html .gitignore README.md \
        public src/main.jsx src/App.jsx src/assets \
        src/styles/variables.css src/styles/index.css
git commit -q -m "chore: estructura base del proyecto Vite + React"
echo "  ✓ commit inicial en main"

# --- 2. Ramas por funcionalidad ---
feature "feature/routing" \
  "feat: configuración de React Router y páginas base" \
  src/routes/AppRoutes.jsx src/pages/Home.jsx src/pages/Unauthorized.jsx src/styles/home.css

feature "feature/auth" \
  "feat: autenticación con login, registro, sesión y validaciones" \
  src/services/api.js src/services/authService.js src/services/mockBackend.js \
  src/utils/validators.js src/utils/format.js \
  src/pages/Login.jsx src/pages/Register.jsx \
  src/styles/login.css src/styles/register.css

feature "feature/protected-routes" \
  "feat: rutas protegidas y validación de acceso por rol" \
  src/routes/ProtectedRoute.jsx src/routes/RoleRoute.jsx

feature "feature/dashboards" \
  "feat: dashboards diferenciados por rol (usuario, coach y admin)" \
  src/layouts src/components/DashboardHeader.jsx \
  src/pages/user src/pages/coach src/pages/admin/AdminDashboard.jsx \
  src/styles/layout.css src/styles/dashboard.css \
  src/styles/userDashboard.css src/styles/coachDashboard.css src/styles/adminDashboard.css

feature "feature/user-management" \
  "feat: módulo gestión de usuarios (CRUD con modal y SweetAlert2)" \
  src/pages/admin/UserManagement.jsx src/components/UserFormModal.jsx \
  src/services/userService.js src/styles/userManagement.css

feature "feature/profile" \
  "feat: módulo mi perfil con edición de datos y cambio de contraseña" \
  src/pages/Profile.jsx src/styles/profile.css

# --- 3. Commit final de documentación en main ---
git add -A
if ! git diff --cached --quiet; then
  git commit -q -m "docs: ajustes finales y documentación del proyecto"
fi

echo ""
echo "¡Listo! Historial creado en la rama main con estas ramas:"
git branch
echo ""
echo "Siguiente paso: sube el proyecto a GitHub (ver GUIA_GITHUB.md)."
