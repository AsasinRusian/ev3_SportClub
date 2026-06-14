# SportClub — Aplicación SPA con React

Sistema de gestión deportiva desarrollado como **Single Page Application (SPA)** con
React, React Router, React-Bootstrap y SweetAlert2. El proyecto consume el **backend
proporcionado en la asignatura** (autenticación, roles y CRUD de usuarios).

Proyecto de la **Unidad 3 — Programación Front End** (Evaluación N°3).

---

## Integrantes

- _(Completa aquí tu nombre / los nombres del equipo)_

---

## Tecnologías utilizadas

- React 18 + Vite
- React Router DOM 6 (navegación SPA y rutas protegidas)
- React-Bootstrap + Bootstrap 5 (componentes y estilos)
- SweetAlert2 (confirmaciones y mensajes)
- CSS propio organizado en `src/styles/`

---

## Estructura del proyecto

```
src/
├── assets/        → logo del club
├── components/    → DashboardHeader, UserFormModal
├── layouts/       → UserLayout, CoachLayout, AdminLayout
├── pages/         → Home, Login, Register, Unauthorized, Profile,
│                    user/, coach/, admin/ (dashboards y CRUD de usuarios)
├── routes/        → AppRoutes, ProtectedRoute, RoleRoute
├── services/      → api, authService, userService (llamadas al backend)
├── styles/        → TODOS los archivos .css del proyecto
├── utils/         → validaciones de formulario
├── App.jsx
└── main.jsx
```

> Convenciones: carpetas en inglés y minúsculas, componentes en PascalCase,
> variables y funciones en inglés, y textos de interfaz en español.

---

## Cómo ejecutar el frontend

Necesitas **Node.js 18 o superior**.

```bash
npm install
npm run dev      # levanta la app en http://localhost:5173
```

Abre **http://localhost:5173** en el navegador.

---

## Cómo ejecutar el backend

Este proyecto usa el **backend de la asignatura**. Debe estar corriendo antes de
iniciar sesión. La URL del backend se configura en `src/services/api.js`:

```js
const API_URL = "http://localhost:3000/api";
```

Ajusta esa constante si tu backend usa otro puerto o ruta base.

El frontend espera que el login y el registro respondan con el formato visto en clase:

```json
{
  "ok": true,
  "message": "Login exitoso.",
  "data": {
    "token": "jwt_generado_por_backend",
    "user": { "id": 5, "full_name": "Demo Admin", "email": "admin@demo.cl", "role": "admin" }
  }
}
```

Roles válidos: `user`, `coach`, `admin`.

---

## Funcionalidades

- **Autenticación**: login y registro conectados al backend, persistencia de sesión en
  `localStorage` y cierre de sesión confirmado con SweetAlert2.
- **Rutas protegidas**: sin sesión no se accede a páginas privadas (`ProtectedRoute`).
- **Control por rol**: cada zona (`/user`, `/coach`, `/admin`) valida el rol
  (`RoleRoute`); un acceso no permitido redirige a `/unauthorized`.
- **Dashboards diferenciados**: usuario (azul), coach (verde) y administrador (morado),
  cada uno con su propia identidad visual, header (logo, Mi Perfil, Cerrar Sesión),
  navegación y contenido.
- **CRUD de usuarios** (admin): listar, crear y editar con **Modal de React-Bootstrap**,
  eliminar con **SweetAlert2** y actualización dinámica de la tabla sin recargar.

---

## Validaciones de frontend

Las validaciones de formulario están en `src/utils/validators.js` y se aplican en
Login, Registro y en el modal de usuarios: campos obligatorios, formato de correo,
largo mínimo de contraseña, coincidencia de contraseñas y feedback inmediato.

> Las validaciones de **backend, base de datos y seguridad** (hash de contraseñas,
> JWT, autorización por rol, restricciones de la BD) las entrega el backend de la
> asignatura. El frontend asume ese contrato y muestra los mensajes de error que la
> API devuelve.

---

## Endpoints que consume el frontend

| Método | Ruta                | Descripción              |
|--------|---------------------|--------------------------|
| POST   | /api/auth/register  | Registro de socios       |
| POST   | /api/auth/login     | Inicio de sesión         |
| GET    | /api/users          | Listar usuarios (admin)  |
| POST   | /api/users          | Crear usuario (admin)    |
| PUT    | /api/users/:id      | Editar usuario (admin)   |
| DELETE | /api/users/:id      | Eliminar usuario (admin) |

Si tu backend usa rutas distintas, ajústalas en `src/services/authService.js` y
`src/services/userService.js`.
