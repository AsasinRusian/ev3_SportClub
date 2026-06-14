# Guía: subir SportClub a GitHub con ramas y commits progresivos

Esta guía deja el proyecto en GitHub cumpliendo: **uso correcto de ramas (branch)** y
**commits claros y progresivos**.

Trabaja en **Git Bash** (la terminal MINGW64), dentro de la carpeta del proyecto
(la que contiene `package.json`).

---

## Paso 1 — Configura tu identidad de Git (una sola vez)

Para que los commits salgan **a tu nombre**:

```bash
git config --global user.name "Tu Nombre Apellido"
git config --global user.email "tucorreo@ejemplo.com"
```

Usa el mismo correo de tu cuenta de GitHub.

---

## Paso 2 — Genera el historial con ramas

Desde la carpeta del proyecto, ejecuta:

```bash
bash git-setup.sh
```

Esto crea el repositorio y un historial **progresivo** con una rama por funcionalidad:

```
main
 ├─ feature/routing            (React Router y páginas base)
 ├─ feature/auth               (login, registro, sesión, validaciones)
 ├─ feature/protected-routes   (rutas protegidas y roles)
 ├─ feature/dashboards         (dashboards por rol)
 ├─ feature/user-management    (CRUD de usuarios)
 └─ feature/profile            (mi perfil y cambio de contraseña)
```

Cada funcionalidad se desarrolla en su propia rama y se fusiona a `main` con
`--no-ff`, de modo que el grafo muestra claramente las ramas.

Para ver el resultado:

```bash
git log --graph --oneline --all
```

---

## Paso 3 — Crea el repositorio en GitHub

1. Entra a <https://github.com> e inicia sesión.
2. Botón **New** (o **+** arriba a la derecha → **New repository**).
3. Nombre: `sportclub` (o el que prefieras).
4. Déjalo **vacío**: NO marques "Add a README", ".gitignore" ni "license".
5. Crea el repositorio y copia la URL que te muestra
   (ej: `https://github.com/tu-usuario/sportclub.git`).

---

## Paso 4 — Conecta y sube todo

En la terminal, dentro de la carpeta del proyecto:

```bash
git remote add origin https://github.com/tu-usuario/sportclub.git
git push -u origin --all
```

`--all` sube `main` y **todas las ramas** `feature/*`.

Recarga la página del repositorio en GitHub: verás tu código, y en el selector de
ramas aparecerán todas las `feature/*`.

---

## Paso 5 (opcional, recomendado) — Demostrar un Pull Request

Las clases mencionaron Pull Requests. Como las ramas ya están fusionadas, para mostrar
un PR puedes crear una rama nueva con un cambio pequeño:

```bash
git checkout -b feature/mejora-readme
# edita el README (por ejemplo agrega tu nombre en Integrantes)
git add README.md
git commit -m "docs: actualiza integrantes en el README"
git push -u origin feature/mejora-readme
```

Luego en GitHub aparecerá un botón **"Compare & pull request"**: ábrelo, revisa los
cambios y haz **Merge pull request**.

(Opcional) Para proteger `main`: en GitHub → **Settings** → **Branches** → **Add rule**,
indica `main` y activa "Require a pull request before merging".

---

## Resumen de buenas prácticas aplicadas

- **No se trabaja directo en `main`**: cada funcionalidad vive en su rama `feature/*`.
- **Commits claros y progresivos**: mensajes con prefijo (`feat`, `chore`, `docs`) que
  describen qué aporta cada paso, construyendo el proyecto de a poco.
- **Fusiones explícitas** (`--no-ff`) para que el historial muestre las ramas.
- `node_modules` y archivos generados quedan fuera del repositorio (`.gitignore`).

---

## Comandos útiles para el día a día

```bash
git status                 # ver estado actual
git branch                 # listar ramas
git checkout -b feature/x  # crear y cambiar a una rama nueva
git add <archivos>         # preparar cambios
git commit -m "feat: ..."  # confirmar un commit
git push                   # subir la rama actual
git log --graph --oneline --all   # ver el historial con ramas
```
