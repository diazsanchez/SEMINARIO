import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./materia.css";

const Materia = () => {
  const navigate = useNavigate();

  // Estados
  const [materias] = useState(["Matemáticas", "Ciencias", "Inglés", "Computación"]);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [nivel, setNivel] = useState("Tests Básicos");
  const [tests, setTests] = useState([]); // Estado para almacenar tests
  const [showCreateForm, setShowCreateForm] = useState(false); // Controla el formulario
  const [newTest, setNewTest] = useState({ nombre: "", estado: "Pendiente" }); // Datos del nuevo test
  const [selectedTest, setSelectedTest] = useState(null); // Test seleccionado para confirmación
  const [showConfirm, setShowConfirm] = useState(false); // Controla el modal de confirmación

  // Simulación de datos de tests
  useEffect(() => {
    const initialTests = selectedMateria
      ? [
          { id: 1, nombre: "Test 1", estado: "Pendiente" },
          { id: 2, nombre: "Test 2", estado: "Resuelto" },
        ]
      : [];
    setTests(initialTests);
  }, [selectedMateria]);

  // Filtrar tests según el estado
  const filteredTests = () => {
    if (filtro === "Todos") return tests;
    return tests.filter((test) => test.estado === filtro);
  };

  // Guardar el nuevo test
  const handleSaveTest = (e) => {
    e.preventDefault();
    if (newTest.nombre.trim() && selectedMateria) {
      const newTestWithId = {
        id: tests.length + 1,
        nombre: newTest.nombre,
        estado: newTest.estado,
      };
      setTests([...tests, newTestWithId]);
      setNewTest({ nombre: "", estado: "Pendiente" });
      setShowCreateForm(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTest((prev) => ({ ...prev, [name]: value }));
  };

  // Confirmar selección de test y regresar al menú principal
  const handleConfirmSelection = () => {
    setShowConfirm(false);
    navigate("/maestro"); // Redirige al menú principal
  };

  // Cancelar selección
  const handleCancelSelection = () => {
    setShowConfirm(false);
    setSelectedTest(null);
  };

  return (
    <div className="materia-container">
      {/* Panel izquierdo - Lista de materias */}
      <aside className="materia-sidebar">
        {materias.map((m, index) => (
          <button
            key={index}
            className={`materia-btn ${selectedMateria === m ? "active" : ""}`}
            onClick={() => setSelectedMateria(m)}
          >
            {m}
          </button>
        ))}
      </aside>

      {/* Panel central - Contenido de tests */}
      <main className="materia-main">
        <div className="materia-filtros">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Resueltos">Resueltos</option>
            <option value="Pendientes">Pendientes</option>
          </select>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="Tests Básicos">Tests Básicos</option>
            <option value="Tests Avanzados">Tests Avanzados</option>
          </select>
          <button
            className="materia-create-btn"
            onClick={() => setShowCreateForm(true)}
            disabled={!selectedMateria}
          >
            Crear Test
          </button>
        </div>

        <div className="materia-lista">
          {selectedMateria ? (
            <>
              <h2 className="materia-title">Tests de {selectedMateria}</h2>
              {filteredTests().length > 0 ? (
                <div className="materia-test-grid">
                  {filteredTests().map((test) => (
                    <div key={test.id} className="materia-test-card">
                      <h3>{test.nombre}</h3>
                      <p>Estado: <span className={`materia-status-${test.estado.toLowerCase()}`}>{test.estado}</span></p>
                      <button
                        className="materia-select-btn"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowConfirm(true);
                        }}
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="materia-no-tests">No hay tests disponibles para este filtro.</p>
              )}
            </>
          ) : (
            <p className="materia-no-tests">Selecciona una materia para ver sus tests.</p>
          )}
        </div>

        {/* Modal/Formulario para crear test */}
        {showCreateForm && (
          <div className="materia-modal-overlay">
            <div className="materia-modal">
              <h3>Crear Nuevo Test</h3>
              <form onSubmit={handleSaveTest}>
                <label>
                  Nombre del Test:
                  <input
                    type="text"
                    name="nombre"
                    value={newTest.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Estado:
                  <select
                    name="estado"
                    value={newTest.estado}
                    onChange={handleInputChange}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </label>
                <div className="materia-modal-actions">
                  <button type="submit" className="materia-create-btn">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="materia-cancel-btn"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación al seleccionar test */}
        {showConfirm && selectedTest && (
          <div className="materia-modal-overlay">
            <div className="materia-modal">
              <h3>Confirmar Selección</h3>
              <p>¿Deseas proceder con el test "<strong>{selectedTest.nombre}</strong>"?</p>
              <div className="materia-modal-actions">
                <button
                  className="materia-confirm-btn"
                  onClick={handleConfirmSelection}
                >
                  Sí
                </button>
                <button
                  className="materia-cancel-btn"
                  onClick={handleCancelSelection}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Panel derecho - Perfil del maestro */}
      <aside className="materia-profile">
        <h3></h3>
        <div className="materia-avatar">
          <span className="avatar-icon">😃</span>
        </div>
        <div className="materia-exp">
          <progress value="100" max="200"></progress>
          <span>100EXP / 200EXP</span>
        </div>
      </aside>
    </div>
  );
};

export default Materia;