// src/router/GuestOnly.jsx
import { Navigate, Outlet } from "react-router-dom";

function parseJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch { return null; }
}
function isTokenValid(token) {
  if (!token) return false;
  const p = parseJwt(token);
  return p && typeof p.exp === "number" && Date.now() < p.exp * 1000;
}

export default function GuestOnly() {
  const token = localStorage.getItem("token");
  const role  = (localStorage.getItem("role") || "").toLowerCase();

  if (isTokenValid(token)) {
    if (["alumno", "director", "maestro"].includes(role)) {
      return <Navigate to={`/${role}`} replace />;
    }
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
