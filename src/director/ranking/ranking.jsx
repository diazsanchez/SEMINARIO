// src/director/ranking/ranking.jsx
export default function Ranking() {
  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  return (
    <div>
      <h1>Ranking</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
