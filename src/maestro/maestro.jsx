import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import "./maestro.css";

const Maestro = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>QuizGames</h2>
        <ul>
          <li>
            <Link to="/maestro/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/maestro/materias">Materias</Link>
          </li>
          <li>
            <Link to="/maestro/quiz">Quiz</Link>
          </li>
          <li>
            <Link to="/maestro/ranking">Ranking</Link>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      {/* Aquí se renderiza la vista según la ruta */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Maestro;
