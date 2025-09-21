import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./maestro.css"; // Importación de estilos

export default function Maestro() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Estados de submenús (persisten al recargar)
  const [openGrado, setOpenGrado] = useState(
    () => localStorage.getItem("m_grado") === "1"
  );
  const [openMateria, setOpenMateria] = useState(
    () => localStorage.getItem("m_materia") === "1"
  );
  const [openQuiz, setOpenQuiz] = useState(
    () => localStorage.getItem("m_quiz") === "1"
  );

  // Guarda el estado del submenú en el almacenamiento local
  useEffect(() => {
    localStorage.setItem("m_grado", openGrado ? "1" : "0");
  }, [openGrado]);
  useEffect(() => {
    localStorage.setItem("m_materia", openMateria ? "1" : "0");
  }, [openMateria]);
  useEffect(() => {
    localStorage.setItem("m_quiz", openQuiz ? "1" : "0");
  }, [openQuiz]);

  // Abre automáticamente el submenú si se entra a esa sección
  useEffect(() => {
    if (pathname.startsWith("/maestro/grado/")) setOpenGrado(true);
    if (pathname.startsWith("/maestro/materia/")) setOpenMateria(true);
    if (pathname.startsWith("/maestro/quiz/")) setOpenQuiz(true);
  }, [pathname]);

  const logout = () => {
    // Limpia las claves de autenticación
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true }); // Dirige a login y evita volver atrás
  };

  const otherLinks = [
    { to: "dashboard", label: "Dashboard", icon: "🏠", end: true },
    { to: "ranking", label: "Ranking", icon: "📊" },
  ];

  const linkBase = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-white/10 ${
      isActive ? "bg-white/10 text-white" : "text-slate-300"
    }`;
  const parentBtn = (active) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-white/10 ${
      active ? "bg-white/10 text-white" : "text-slate-300"
    }`;

  const gradoActive = pathname.startsWith("/maestro/grado/");
  const materiaActive = pathname.startsWith("/maestro/materia/");
  const quizActive = pathname.startsWith("/maestro/quiz/");

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ======== SIDEBAR FIJO ======== */}
      <aside
        className="
          fixed inset-y-0 left-0 w-72 z-40
          bg-slate-900/95 text-slate-200 p-4
          border-r border-white/10
          flex flex-col
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 grid place-items-center text-white text-lg">
            👩‍🏫
          </div>
          <span className="font-extrabold tracking-wide">QuizGames</span>
        </div>

        {/* Navegación (ocupa el espacio y permite scroll) */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {/* ===== GRADO (padre botón) ===== */}
            <li>
              <button
                type="button"
                onClick={() => setOpenGrado((v) => !v)}
                className={parentBtn(gradoActive || openGrado)}
              >
                <span className="text-lg">🎓</span>
                <span className="text-sm">Grado</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openGrado || gradoActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openGrado || gradoActive) && (
              <>
                <li>
                  <NavLink
                    to="grado/lista"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">📋</span>
                    <span>Lista de Grados</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== MATERIA (padre botón) ===== */}
            <li>
              <button
                type="button"
                onClick={() => setOpenMateria((v) => !v)}
                className={parentBtn(materiaActive || openMateria)}
              >
                <span className="text-lg">📚</span>
                <span className="text-sm">Materia</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openMateria || materiaActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openMateria || materiaActive) && (
              <>
                <li>
                  <NavLink
                    to="materia/lista"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">📝</span>
                    <span>Lista de Materias</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== QUIZ (padre botón) ===== */}
            <li>
              <button
                type="button"
                onClick={() => setOpenQuiz((v) => !v)}
                className={parentBtn(quizActive || openQuiz)}
              >
                <span className="text-lg">🧠</span>
                <span className="text-sm">Quiz</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openQuiz || quizActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openQuiz || quizActive) && (
              <>
                <li>
                  <NavLink
                    to="quiz/crear"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">➕</span>
                    <span>Crear Quiz</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="quiz/listar"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">📝</span>
                    <span>Mis Quiz</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== OTRAS ===== */}
            {otherLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => linkBase(isActive)}
                >
                  <span className="text-lg">{l.icon}</span>
                  <span className="text-sm">{l.label}</span>
                  <span className="ml-auto text-xs opacity-40">›</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* === Cerrar sesión === */}
        <button
          onClick={logout}
          className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700
                   text-white text-sm transition shadow mt-4"
        >
          Cerrar sesión
        </button>
      </aside>
      {/* ======== /SIDEBAR FIJO ======== */}

      {/* ======== CONTENIDO ======== */}
      <div className="ml-72 min-h-screen p-3">
        <div className="bg-slate-800/20 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
            <button className="px-3 py-2 rounded-md hover:bg-slate-100" aria-label="menu">
              ☰
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">ES</span>
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="w-8 h-8 rounded-full bg-slate-300" />
            </div>
          </header>

          <main className="p-6 min-h-[calc(100vh-3.5rem)] bg-white">
            <Outlet />
          </main>
        </div>
      </div>
      {/* ======== /CONTENIDO ======== */}
    </div>
  );
}