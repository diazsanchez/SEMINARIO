import { useState } from "react";
import "./quizes.css"; // Opcional si quieres separar los estilos

import { motion, AnimatePresence } from "framer-motion";

export default function Quizes() {
const [filtro, setFiltro] = useState("todo");

  const testBasicos = ["Test básico 1", "Test básico 2", "Test básico 3"];
  const testAvanzados = ["Test avanzado 1", "Test avanzado 2"];

  const getTests = () => {
    if (filtro === "basicos") return testBasicos;
    if (filtro === "avanzados") return testAvanzados;
    return [...testBasicos, ...testAvanzados];
  };

  const tests = getTests();

  return (
    <div className="quizes-container">
      <h2>Quizes</h2>

      {/* Grupo de botones */}
      <div className="quizes-buttons">
        <button
          className={filtro === "todo" ? "active" : ""}
          onClick={() => setFiltro("todo")}
        >
          Todo
        </button>
        <button
          className={filtro === "basicos" ? "active" : ""}
          onClick={() => setFiltro("basicos")}
        >
          Test Básicos
        </button>
        <button
          className={filtro === "avanzados" ? "active" : ""}
          onClick={() => setFiltro("avanzados")}
        >
          Test Avanzados
        </button>
      </div>

      {/* Contenido según filtro con animación */}
      <div className="quizes-grid">
        <AnimatePresence>
          {tests.map((t, i) => (
            <motion.div
              key={t}
              className="quizes-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {t}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
