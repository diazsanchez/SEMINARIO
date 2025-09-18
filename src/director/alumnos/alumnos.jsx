// src/director/alumnos/alumnos.jsx
export default function Alumnos() {
  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  return (
    <div>
      <h1>Gestión de Alumnos</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
