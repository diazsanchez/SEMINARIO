// src/services/authService.js
const API_ROOT = "http://localhost:3001/api";
const LOGIN_URL = `${API_ROOT}/auth/login`;

// ---------- helpers ----------
function parseJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

function normalizeRole(r) {
  if (!r) return "";
  const v = String(r).toLowerCase().trim();
  if (["alumno", "maestro", "director"].includes(v)) return v;
  // Acepta variantes comunes
  if (["student", "estudiante"].includes(v)) return "alumno";
  if (["teacher", "profesor", "docente"].includes(v)) return "maestro";
  if (["admin", "director(a)"].includes(v)) return "director";
  return "";
}

function extractRoleFromUser(user) {
  if (!user) return "";
  // intenta propiedades típicas
  const candidates = [
    user.role,
    user.rol,
    user?.rol?.nombre,
    user?.rol?.name,
    user?.rol?.tipo,
    Array.isArray(user.roles) ? user.roles[0] : undefined,
    user?.tipo,
    user?.perfil,
  ].filter(Boolean);
  for (const c of candidates) {
    const n = normalizeRole(c);
    if (n) return n;
  }
  return "";
}

function extractRoleFromToken(token) {
  const p = parseJwt(token);
  if (!p) return "";
  const candidates = [
    p.role,
    p.rol,
    p?.rol?.nombre,
    p?.rol?.name,
    p?.rol?.tipo,
    Array.isArray(p.roles) ? p.roles[0] : undefined,
    Array.isArray(p.authorities) ? p.authorities[0] : undefined,
    p?.tipo,
  ].filter(Boolean);
  for (const c of candidates) {
    const n = normalizeRole(c);
    if (n) return n;
  }
  return "";
}

// ---------- sesión ----------
function setSession(token, user, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user || null));
  if (role) localStorage.setItem("role", role);
  else localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
export function getRole() {
  return localStorage.getItem("role") || "";
}
export function getAuthHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role"); // 🔐 importante
}

// ---------- login ----------
export async function login(correo, contrasena) {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!res.ok) {
    let msg = "Error de autenticación";
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();

  const token =
    data?.access_token ||
    data?.token ||
    data?.jwt ||
    data?.data?.access_token ||
    data?.data?.token;

  if (!token) throw new Error("No se recibió un token.");

  const user =
    data?.user || data?.usuario || data?.data?.user || data?.data?.usuario || null;

  // 🏷️ rol desde user o desde el JWT
  const roleFromUser = extractRoleFromUser(user);
  const roleFromJwt = extractRoleFromToken(token);
  const role = roleFromUser || roleFromJwt || ""; // si no hay, queda vacío

  setSession(token, user, role);
  return { token, user, role };
}
