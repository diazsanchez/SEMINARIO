// src/alumno/alumno.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./alumno.css";

export default function Alumno() {
  const navigate = useNavigate();
  const [openMaterias, setOpenMaterias] = useState(false);

  const logout = () => {
    // Limpia solo claves de auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    // Evita volver con "atrás"
    navigate("/login", { replace: true });
  };

  // helper para clases activas
  const linkClass = ({ isActive }) =>
    "alumno-link" + (isActive ? " active" : "");

  return (
    <div className="alumno-container">
      {/* Sidebar */}
      <aside className="alumno-sidebar">
        <div className="alumno-brand">
          <div className="alumno-logo">🎓</div>
          <span className="alumno-title">Sabelotodo</span>
        </div>

        <nav className="alumno-nav">
          <ul>
            {/* Dashboard */}
            <li>
              <NavLink
                end
                to="dashboard"
                className="alumno-parent-btn"
              >
                <span>📝</span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* Materias (padre) */}
            <li>
              <button
                type="button"
                className={`alumno-parent-btn ${openMaterias ? "active" : ""}`}
                onClick={() => setOpenMaterias((v) => !v)}
              >
                <span>📘</span>
                <span>Materias</span>
                <span className="arrow">›</span>
              </button>
            </li>

            {/* Materias (subenlace) */}
            {openMaterias && (
              <li>
                <NavLink
                  to="materias"
                  className={(p) => "alumno-link sublink" + (p.isActive ? " active" : "")}
                >
                  {/* consumo de api */}
                  <span>📂</span>
                  <span>Materias</span>
                </NavLink>
              </li>
            )}

            {/* Quizes */}
            <li>
              <NavLink to="quizes" className="alumno-parent-btn">
                <span>📝</span>
                <span>Quizes</span>
              </NavLink>
            </li>

            {/* Tienda */}
            <li>
              <NavLink to="tienda" className="alumno-parent-btn">
                <span>🛍️</span>
                <span>Tienda</span>
              </NavLink>
            </li>

            {/* Perfil */}
            <li>
              <NavLink to="perfil" className="alumno-parent-btn">
                <span>👤</span>
                <span>Perfil</span>
              </NavLink>
            </li>
          </ul>

          <button onClick={logout} className="alumno-logout">
            Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenido */}
      <div className="alumno-content">
        <div className="alumno-card">
          <header className="alumno-header">
            <button aria-label="menu">☰</button>
            <div className="alumno-header-right">
              <span>ES</span>
              <div className="avatar light"></div>
              <div className="avatar dark"></div>
            </div>
          </header>

          <main className="alumno-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
