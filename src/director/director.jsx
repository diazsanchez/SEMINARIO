// src/director/director.jsx
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Director() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Estado de submenús (persistido)
  const [openMaterias, setOpenMaterias] = useState(
    () => localStorage.getItem("o_materias") === "1"
  );
  const [openMaestros, setOpenMaestros] = useState(
    () => localStorage.getItem("o_maestros") === "1"
  );
  // 🔵 USUARIOS (nuevo)
  const [openUsuarios, setOpenUsuarios] = useState(
    () => localStorage.getItem("o_usuarios") === "1"
  );

  useEffect(() => {
    localStorage.setItem("o_materias", openMaterias ? "1" : "0");
  }, [openMaterias]);
  useEffect(() => {
    localStorage.setItem("o_maestros", openMaestros ? "1" : "0");
  }, [openMaestros]);
  // 🔵 USUARIOS (nuevo)
  useEffect(() => {
    localStorage.setItem("o_usuarios", openUsuarios ? "1" : "0");
  }, [openUsuarios]);

  // Solo ABRE automáticamente si entras a la sección; NO cierra al salir
  useEffect(() => {
    if (pathname.startsWith("/director/materias/")) setOpenMaterias(true);
    if (pathname.startsWith("/director/maestros/")) setOpenMaestros(true);
    // 🔵 USUARIOS (nuevo)
    if (pathname.startsWith("/director/usuarios/")) setOpenUsuarios(true);
  }, [pathname]);

  const logout = () => {
    // Limpia solo claves de auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true }); // evita volver con "atrás"
  };

  const otherLinks = [
    { to: "alumnos", label: "Alumnos", icon: "👨‍🎓" },
    { to: "quiz", label: "Quiz", icon: "📝" },
    { to: "ranking", label: "Ranking", icon: "📊" },
    { to: "perfil", label: "Mi Perfil", icon: "👤", end: true }, // end para match exacto
  ];

  const linkBase = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-white/10 ${
      isActive ? "bg-white/10 text-white" : "text-slate-300"
    }`;
  const parentBtn = (active) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-white/10 ${
      active ? "bg-white/10 text-white" : "text-slate-300"
    }`;

  const materiasActive = pathname.startsWith("/director/materias/");
  const maestrosActive = pathname.startsWith("/director/maestros/");
  // 🔵 USUARIOS (nuevo)
  const usuariosActive = pathname.startsWith("/director/usuarios/");

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
          <div className="w-9 h-9 rounded-full bg-indigo-600 grid place-items-center text-white text-lg">
            🎓
          </div>
          <span className="font-extrabold tracking-wide">WINDZON</span>
        </div>

        {/* Navegación (ocupa el espacio y permite scroll) */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {/* ===== MATERIAS (padre botón; NO navega) ===== */}
            <li>
              <button
                type="button"
                onClick={() => setOpenMaterias((v) => !v)}
                className={parentBtn(materiasActive || openMaterias)}
              >
                <span className="text-lg">📘</span>
                <span className="text-sm">Asignaciones</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openMaterias || materiasActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openMaterias || materiasActive) && (
              <>
                <li>
                  <NavLink
                    to="materias/crearmaterias"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">➕</span>
                    <span>Crear Materia</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="materias/mismaterias"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">📂</span>
                    <span>Mis Materias</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== MAESTROS (padre botón; NO navega) ===== */}
            <li>
              <button
                type="button"
                onClick={() => setOpenMaestros((v) => !v)}
                className={parentBtn(maestrosActive || openMaestros)}
              >
                <span className="text-lg">👩‍🏫</span>
                <span className="text-sm">Maestros</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openMaestros || maestrosActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openMaestros || maestrosActive) && (
              <>
                <li>
                  <NavLink
                    to="maestros/crearmaestro"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">➕</span>
                    <span>Crear Maestro</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== USUARIOS (padre botón; NO navega) ===== */} {/* 🔵 NUEVO */}
            <li>
              <button
                type="button"
                onClick={() => setOpenUsuarios((v) => !v)}
                className={parentBtn(usuariosActive || openUsuarios)}
              >
                <span className="text-lg">👥</span>
                <span className="text-sm">Usuarios</span>
                <span
                  className={`ml-auto text-xs opacity-40 transition-transform ${
                    openUsuarios || usuariosActive ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </li>
            {(openUsuarios || usuariosActive) && (
              <>
                <li>
                  <NavLink
                    to="usuarios/crear"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">➕</span>
                    <span>Crear Usuario</span>
                  </NavLink>
                </li>
                {/* Si luego agregas una lista:
                <li>
                  <NavLink
                    to="usuarios/lista"
                    className={({ isActive }) => linkBase(isActive) + " pl-10 text-[13px]"}
                  >
                    <span className="text-lg">📋</span>
                    <span>Lista de Usuarios</span>
                  </NavLink>
                </li>
                */}
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

        {/* === Zona inferior: Maestro (arriba) + Cerrar sesión (abajo) === */}
        <NavLink
          to="maestros/crearmaestro"
          className="mb-3 inline-flex items-center justify-center gap-2 w-full px-3 py-2
                     rounded-lg text-sm font-medium
                     bg-indigo-600 hover:bg-indigo-500 text-white shadow transition"
        >
          👩‍🏫 <span>Maestro</span>
        </NavLink>

        <button
          onClick={logout}
          className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700
                     text-white text-sm transition shadow"
        >
          Cerrar sesión
        </button>
      </aside>
      {/* ======== /SIDEBAR FIJO ======== */}

      {/* ======== CONTENIDO (margen para no tapar) ======== */}
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
