// src/services/rolesService.js
import { getAuthHeaders } from "./authService";

const ROLES_URL = "http://localhost:3001/api/roles";

export async function listRoles() {
  const res = await fetch(ROLES_URL, { headers: getAuthHeaders() });
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.message || "No se pudieron cargar los roles");
  return Array.isArray(data) ? data : data?.data || [];
}

export async function getRolById(id) {
  const res = await fetch(`${ROLES_URL}/${id}`, { headers: getAuthHeaders() });
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.message || "No se pudo obtener el rol");
  return data; // { id, nombre, ... }
}
