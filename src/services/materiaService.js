import { getAuthHeaders } from "./authService";

const API_ROOT = "http://localhost:3001/api";
const MATERIAS_URL = `${API_ROOT}/materias`;

// Pistas típicas de duplicado cuando el backend rompe por índice único
const DUP_PAT = /(E11000|duplicate key|duplicad|ya existe|únic|unique)/i;

/** Normaliza mensaje de error desde JSON o texto */
async function parseErrorMessage(res, fallback) {
  let body = "";
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      let msg = j?.message ?? j?.error ?? j?.msg ?? "";
      if (Array.isArray(msg)) msg = msg.join(", ");
      body = String(msg || "");
    } else {
      body = await res.text();
    }
  } catch {}

  if (res.status === 409 || DUP_PAT.test(body)) return "La materia ya existe";
  return body?.trim() ? body : fallback;
}

/** Lista todas las materias */
export async function listarMaterias() {
  const res = await fetch(MATERIAS_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudieron cargar las materias"));
  const data = await res.json().catch(() => ({}));
  return Array.isArray(data) ? data : data?.data || [];
}

/** Obtiene una materia por id */
export async function getMateriaById(id) {
  const res = await fetch(`${MATERIAS_URL}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo obtener la materia"));
  const data = await res.json().catch(() => ({}));
  return data; // { _id/id, nombre, temas: string[] }
}

/** Crea una materia */
export async function crearMateria({ nombre, temas = [] }) {
  const res = await fetch(MATERIAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ nombre, temas }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo crear la materia"));
  const data = await res.json().catch(() => ({}));
  return data?.data || data;
}

/** Actualiza parcial (por ejemplo { nombre } o { temas }) */
export async function actualizarMateria(id, parcial) {
  const res = await fetch(`${MATERIAS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(parcial),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo actualizar la materia"));
  const data = await res.json().catch(() => ({}));
  return data?.data || data;
}

/** Elimina una materia */
export async function eliminarMateria(id) {
  const res = await fetch(`${MATERIAS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "No se pudo eliminar la materia"));
  try { return await res.json(); } catch { return true; }
}

/* ---------- Helpers de temas ---------- */

export async function agregarTema(id, tema) {
  const m = await getMateriaById(id);
  const temas = Array.isArray(m?.temas) ? m.temas.slice() : [];
  if (!tema || temas.includes(tema)) return m;
  temas.push(tema);
  return actualizarMateria(id, { temas });
}

export async function quitarTema(id, tema) {
  const m = await getMateriaById(id);
  const temas = (Array.isArray(m?.temas) ? m.temas : []).filter(t => t !== tema);
  return actualizarMateria(id, { temas });
}

export async function setTemas(id, temas) {
  return actualizarMateria(id, { temas: Array.isArray(temas) ? temas : [] });
}
