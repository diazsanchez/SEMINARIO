import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../maestro.css"; // Importación de estilos generales
import "./dashboard.css"; // Estilos específicos para Dashboard

const LOCAL_STORAGE_KEY = "quizgames.quizzes";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedGrado, setSelectedGrado] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEstados, setShowEstados] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("Todo");

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [quizForm, setQuizForm] = useState({
    nombre: "",
    grado: "Primero Básico",
    dificultad: "Básico",
    materia: "",
    estado: "Pendiente",
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizzes));
  }, [quizzes]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    setQuizzes((prev) => [...prev, quizForm]);
    setShowModal(false);
    setQuizForm({
      nombre: "",
      grado: "Primero Básico",
      dificultad: "Básico",
      materia: "",
      estado: "Pendiente",
    });
  };

  const handleDeleteQuiz = (index) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
  };

  const handleCompleteQuiz = (index) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, i) =>
        i === index ? { ...quiz, estado: "Completado" } : quiz
      )
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleGradoSelect = (grado) => {
    setSelectedGrado(grado);
    setSelectedMateria(null);
    setActiveSection("materiasList");
  };

  const handleMateriaSelect = (materia) => {
    setSelectedMateria(materia);
    setActiveSection("quiz");
  };

  // --- Datos ---
  const materiasPorGrado = {
    "Primero Básico": ["Sociales", "Matemáticas", "Ciencias"],
    "Segundo Básico": ["Sociales", "Matemáticas"],
    "Tercero Básico": ["Ciencias", "Matemáticas"],
  };

  const materiasMostrar = selectedGrado
    ? materiasPorGrado[selectedGrado] || []
    : [];

  const quizzesFiltrados = () => {
    if (!filtroEstado || filtroEstado === "Todo") return quizzes;
    return quizzes.filter(
      (q) => q.estado.toLowerCase() === filtroEstado.toLowerCase()
    );
  };

  const calcularRanking = () => {
    const ranking = {};

    quizzes.forEach((q) => {
      if (q.estado === "Completado") {
        if (!ranking[q.materia]) {
          ranking[q.materia] = 0;
        }
        ranking[q.materia] += 1;
      }
    });

    return Object.entries(ranking)
      .map(([materia, cantidad]) => ({ materia, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  };

  // --- Render ---
  return (
    <div className="container">
      {/* Main Content */}
      <main className="main-content">
        {/* --- Dashboard --- */}
        {activeSection === "dashboard" && (
          <section>
            <h1>Dashboard por Materia</h1>
            <button
              onClick={() => setShowEstados((prev) => !prev)}
              className="filter-btn"
            >
              {filtroEstado} {showEstados ? "▲" : "▼"}
            </button>
            {showEstados && (
              <div className="dropdown-estados">
                {["Pendiente", "En proceso", "Completado", "Todo"].map(
                  (estado) => (
                    <div
                      key={estado}
                      onClick={() => {
                        setFiltroEstado(estado);
                        setShowEstados(false);
                      }}
                    >
                      {estado}
                    </div>
                  )
                )}
              </div>
            )}
            <div className="dashboard-grid">
              <div className="dashboard-col">
                <h3>
                  {filtroEstado === "Todo"
                    ? "Todos los Quizzes"
                    : `Quizzes ${filtroEstado}`}
                </h3>
                {quizzesFiltrados().length === 0 ? (
                  <p className="empty-text">No hay quizzes en esta categoría</p>
                ) : (
                  quizzesFiltrados().map((quiz, i) => (
                    <p key={i} className="quiz-item">
                      • {quiz.nombre} ({quiz.materia} - {quiz.grado}) -{" "}
                      {quiz.estado}
                    </p>
                  ))
                )}
              </div>
              <div className="dashboard-col completados">
                <h2>Completados</h2>
                {["Matemáticas", "Sociales", "Ciencias"].map((materia) => {
                  const completados = quizzes.filter(
                    (q) => q.materia === materia && q.estado === "Completado"
                  );
                  return (
                    <div key={materia}>
                      <h3>{materia}</h3>
                      {completados.length === 0 ? (
                        <p className="empty-text">No hay quizzes completados</p>
                      ) : (
                        completados.map((quiz, index) => (
                          <p key={index} className="quiz-item">
                            • {quiz.nombre}
                          </p>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* --- Materias --- */}
        {activeSection === "materias" && (
          <section>
            <h1>Mis materias</h1>
            <div className="cards">
              {Object.keys(materiasPorGrado).map((grado) => (
                <div className="card purple" key={grado}>
                  <h3>{grado}</h3>
                  <button onClick={() => handleGradoSelect(grado)}>
                    Ingresar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Lista de materias --- */}
        {activeSection === "materiasList" && selectedGrado && (
          <section>
            <h1>{selectedGrado}</h1>
            <p>Seleccione una materia:</p>
            <div className="cards">
              {materiasMostrar.map((materia, idx) => (
                <div className="card blue" key={idx}>
                  <h3>{materia}</h3>
                  <button onClick={() => handleMateriaSelect(materia)}>
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Quizzes --- */}
        {activeSection === "quiz" && (
          <section>
            <h1>
              Quizzes de {selectedGrado || "Todos"}{" "}
              {selectedMateria ? `- ${selectedMateria}` : ""}
            </h1>
            <button
              className="create-btn small-btn"
              onClick={() => setShowModal(true)}
            >
              Crear Quiz
            </button>
            <table className="quiz-table smaller-text">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Grado</th>
                  <th>Materia</th>
                  <th>Dificultad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No hay quizzes todavía
                    </td>
                  </tr>
                ) : (
                  quizzes
                    .filter(
                      (q) =>
                        (!selectedGrado || q.grado === selectedGrado) &&
                        (!selectedMateria || q.materia === selectedMateria)
                    )
                    .map((q, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{q.nombre}</td>
                        <td>{q.grado}</td>
                        <td>{q.materia}</td>
                        <td>{q.dificultad}</td>
                        <td>{q.estado}</td>
                        <td>
                          {q.estado === "Pendiente" && (
                            <button
                              className="complete-btn"
                              onClick={() => handleCompleteQuiz(index)}
                            >
                              Enviar respuestas
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteQuiz(index)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* --- Ranking --- */}
        {activeSection === "ranking" && (
          <section>
            <h1>Ranking por Materia</h1>
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Materia</th>
                  <th>Quizzes Completados</th>
                </tr>
              </thead>
              <tbody>
                {calcularRanking().length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No hay datos de ranking aún
                    </td>
                  </tr>
                ) : (
                  calcularRanking().map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.materia}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {/* --- Modal para crear quiz --- */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h3>Crear nuevo Quiz</h3>
            <form onSubmit={handleAddQuiz}>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={quizForm.nombre}
                onChange={handleInputChange}
                required
              />
              <label>Grado:</label>
              <select
                name="grado"
                value={quizForm.grado}
                onChange={handleInputChange}
              >
                <option>Primero Básico</option>
                <option>Segundo Básico</option>
                <option>Tercero Básico</option>
              </select>
              <label>Materia:</label>
              <select
                name="materia"
                value={quizForm.materia}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione</option>
                <option>Sociales</option>
                <option>Matemáticas</option>
                <option>Ciencias</option>
              </select>
              <label>Dificultad:</label>
              <select
                name="dificultad"
                value={quizForm.dificultad}
                onChange={handleInputChange}
              >
                <option>Básico</option>
                <option>Avanzado</option>
              </select>
              <label>Estado:</label>
              <select
                name="estado"
                value={quizForm.estado}
                onChange={handleInputChange}
              >
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Completado</option>
              </select>
              <button type="submit" className="next-btn">
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;