import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Estilos de Bootstrap (React-Bootstrap usa estas clases)
import "bootstrap/dist/css/bootstrap.min.css";
// Estilos globales del proyecto
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
