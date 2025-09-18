// src/login/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import logoUMG from "./image/UMG1.jpeg";
import gif from "./image/idea.gif";
import "./login.css";

// Base de API (solo para armar URLs)
const API_ROOT = "http://localhost:3001/api";

// ===== Helpers =====
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}
function isObjectId(v) {
  return /^[0-9a-fA-F]{24}$/.test(String(v || ""));
}
/** Devuelve un id string a partir de varias formas posibles */
function pickId(val) {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (typeof val._id === "string") return val._id;
    if (typeof val.id === "string") return val.id;
    if (typeof val.$oid === "string") return val.$oid;
    const s = val.toString?.();
    if (isObjectId(s)) return s;
  }
  return null;
}
async function getJsonAuth(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    let msg = `Error ${res.status} al consultar ${url}`;
    try { msg = (await res.json())?.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}
// ====================

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Si ya hay sesión, no permitir ver /login
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      const role = (localStorage.getItem("role") || "alumno").toLowerCase();
      navigate(`/${role}`, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    const key = (email || "").trim();

    // ✅ Validación mínima
    if (!key) return setErr("Ingresa tu correo.");
    if (!password) return setErr("Ingresa tu contraseña.");

    try {
      // 1) Login -> { access_token, (opcional) user }
      const { token, user } = await apiLogin(key, password);

      // 2) Intentar rol directo de la respuesta
      let role =
        user?.rol ||
        user?.role ||
        user?.rolNombre ||
        user?.rol?.nombre;

      // 3) Si no vino rol, resolver usuario -> id_rol -> rol.nombre
      if (!role) {
        const payload = decodeJwt(token);
        const sub = payload?.sub || payload?.id || payload?._id || payload?.correo || payload?.email;

        let usuario;
        if (isObjectId(sub)) {
          usuario = await getJsonAuth(`${API_ROOT}/usuarios/${sub}`, token);
        } else {
          const tries = [
            `${API_ROOT}/usuarios/correo/${encodeURIComponent(key)}`,
            `${API_ROOT}/usuarios/by-email/${encodeURIComponent(key)}`,
            `${API_ROOT}/usuarios?correo=${encodeURIComponent(key)}`,
            `${API_ROOT}/usuarios?email=${encodeURIComponent(key)}`
          ];
          for (const url of tries) {
            try {
              const data = await getJsonAuth(url, token);
              usuario = Array.isArray(data) ? data[0] : data;
              if (usuario) break;
            } catch { /* intenta siguiente */ }
          }
        }
        if (!usuario) throw new Error("Usuario no encontrado después del login.");

        const rolId =
          pickId(usuario?.id_rol) ||
          pickId(usuario?.rolId) ||
          pickId(usuario?.rol);

        if (!rolId || !isObjectId(rolId)) {
          throw new Error("El usuario no tiene un id_rol válido.");
        }

        const rol = await getJsonAuth(`${API_ROOT}/roles/${rolId}`, token);
        role = rol?.nombre || rol?.name || rol?.role || "alumno";

        localStorage.setItem("user", JSON.stringify(usuario));
      } else {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // 4) Guardar y redirigir (sin poder volver con “atrás”)
      role = role.toString().toLowerCase();
      localStorage.setItem("role", role);
      localStorage.setItem("email", key);
      navigate(`/${role}`, { replace: true });
    } catch (_e) {
      // ❗️Mensaje genérico solicitado
      setErr("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="legacy-login">
      <div className="container">
        <div className="form-container sign-in">
          <img className="gif-idea" src={gif} alt="" />
          <img className="gif-idea1" src={gif} alt="" />

          <form onSubmit={handleLogin}>
            <h1 className="titulo">Inicio de sesión</h1>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-style"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-style"
              required
            />

            {err && (
              <p className="error" style={{ marginTop: 8, color: "#ef4444" }}>
                {err}
              </p>
            )}

            <button type="submit" className="btn-style">
              Entrar
            </button>
            <p className="back-link">
              <Link to="/">← Volver</Link>
            </p>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <div className="welcome-container">
                <h1 className="quiz">
                  <span className="material-symbols-outlined">stars_2</span>
                  <span className="sabe">SABE</span>
                  <span className="lo">lo</span>
                  <span className="todo">TODO</span>
                  <span className="material-symbols-outlined">stars_2</span>
                </h1>
                <img className="logo-imag" src={logoUMG} alt="Logo Mariano Gálvez" />
                <h2 className="titulo2">¡Bienvenido a esta aplicación Educativa!</h2>
                <p>
                  Nosotros, los universitarios de la Universidad Mariano Gálvez,
                  tenemos como propósito potenciar el aprendizaje
                </p>
                <p>mediante dinámicas de juego interactivas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
