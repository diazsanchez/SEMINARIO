// src/director/quiz/quiz.jsx
export default function Quiz() {
  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  return (
    <div>
      <h1>Gestión de Quiz</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
