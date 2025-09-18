// src/router/Protected.jsx
import { useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function parseJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const p = parseJwt(token);
  if (!p || typeof p.exp !== "number") return false;
  return Date.now() < p.exp * 1000;
}

// Componente auxiliar: bloquea la navegación y regresa a donde estabas
function BlockAndStay({ role }) {
  const navigate = useNavigate();
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current) return;
    tried.current = true;

    // 1) Si hay historial, volvemos a la pantalla anterior
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // 2) Si NO hay historial (entró directo por URL), lo mandamos a su home de rol
    if (["alumno", "director", "maestro"].includes(role)) {
      navigate(`/${role}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, role]);

  // No renderizamos nada mientras lo devolvemos
  return null;
}

export default function Protected({ allow, children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  // Si el token no sirve, al login
  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }

  // Si se especifica "allow" y el rol no coincide, NO navegamos a 403:
  // bloqueamos y regresamos a donde estaba el usuario.
  if (allow) {
    const ok = Array.isArray(allow) ? allow.includes(role) : role === allow;
    if (!ok) {
      return <BlockAndStay role={role} />;
    }
  }

  // Si todo bien, render normal
  return children ?? <Outlet />;
}
