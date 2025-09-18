// usuariosService.js
// src/services/usuariosService.js
import { getAuthHeaders } from "./authService";

const API_ROOT = "http://localhost:3001/api";
const USUARIOS_URL = `${API_ROOT}/usuarios`;

/** Listar todos */
export async function listarUsuarios() {
  const res = await fetch(USUARIOS_URL, { headers: getAuthHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "No se pudieron cargar los usuarios");
  return Array.isArray(data) ? data : data?.data || [];
}

/** Obtener por ID */
export async function getUsuarioById(id) {
  const res = await fetch(`${USUARIOS_URL}/${id}`, { headers: getAuthHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "No se pudo obtener el usuario");
  return data;
}

/** Crear  */
export async function crearUsuario(payload) {
  // payload debe tener las mismas claves que tu CreateUsuarioDto
  // Ejemplo típico: { correo, contrasena, id_rol }
  const res = await fetch(USUARIOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "No se pudo crear el usuario");
  return data?.data || data;
}

/** Actualizar (usa PATCH según tu controlador) */
export async function actualizarUsuario(id, partialPayload) {
  // partialPayload debe seguir UpdateUsuarioDto (solo campos a modificar)
  const res = await fetch(`${USUARIOS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(partialPayload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "No se pudo actualizar el usuario");
  return data?.data || data;
}

/** Eliminar */
export async function eliminarUsuario(id) {
  const res = await fetch(`${USUARIOS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    let data = null; try { data = await res.json(); } catch {}
    throw new Error(data?.message || "No se pudo eliminar el usuario");
  }
  // Algunos backends devuelven {} o un mensaje; retorna lo que venga
  try { return await res.json(); } catch { return true; }
}
