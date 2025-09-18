import { useEffect, useState } from "react";

export default function Materias() {
  const [materias, setMaterias] = useState([]);

  // Simulación: luego se sustituye por fetch a tu API
  useEffect(() => {
    // Aquí iría la llamada al backend con el ID del alumno
    // Ejemplo: fetch(`/api/materias/${alumnoId}`)
    const mockMaterias = [
      { id: 1, nombre: "Matemática" },
      { id: 2, nombre: "Lenguaje" },
      { id: 3, nombre: "Ciencias Naturales" },
    ];
    setMaterias(mockMaterias);
  }, []);

  return (
    <div>
      <h2>📘 Mis Materias</h2>
      {materias.length === 0 ? (
        <p>No tienes materias asignadas aún.</p>
      ) : (
        <ul>
          {materias.map((m) => (
            <li key={m.id}>{m.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
