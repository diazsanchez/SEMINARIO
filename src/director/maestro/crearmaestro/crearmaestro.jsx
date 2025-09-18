// src/director/maestro/crearmaestro/crearmaestro.jsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const LS_KEY_MAESTROS = "maestros";
const LS_KEY_MATERIAS  = "materias";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function loadMaestros() {
  const fromLS = JSON.parse(localStorage.getItem(LS_KEY_MAESTROS) || "null");
  return Array.isArray(fromLS) ? fromLS : [];
}
function saveMaestros(list) {
  localStorage.setItem(LS_KEY_MAESTROS, JSON.stringify(list));
}
function loadMaterias() {
  return JSON.parse(localStorage.getItem(LS_KEY_MATERIAS) || "[]");
}

// Hash (DEMO)
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// Autogenera email si falta (semillas antiguas)
const toEmailFromName = (name) =>
  (name || "usuario")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") + "@gmail.com";

/* ======= Cuentas fijas que deben APARECER como maestros ======= */
const FIXED_MAESTROS = [
  {
    id: "fixed-jorge",
    nombre: "Jorge Director",
    email: "jorge@umg.edu",
    fixed: true,
    // contraseña "123" solo por consistencia con login de maestros (no se usa aquí)
    passwordHash: null, // lo seteamos on-mount
  },
  {
    id: "fixed-stephanie",
    nombre: "Stephanie Maestro",
    email: "stephanie@umg.edu",
    fixed: true,
    passwordHash: null, // lo seteamos on-mount
  },
];

export default function CrearMaestro() {
  const [maestros, setMaestros] = useState(useMemo(loadMaestros, []));
  const [materias,  setMaterias]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });

  useEffect(() => { setMaterias(loadMaterias()); }, []);

  // 1) Siembra/merge de cuentas fijas en la lista de maestros
  useEffect(() => {
    (async () => {
      let current = loadMaestros();
      let changed = false;

      // hash para "123"
      const fixedHash = await sha256("123");

      FIXED_MAESTROS.forEach((fx) => {
        const exists = current.some(
          (m) => (m.email || "").toLowerCase() === fx.email.toLowerCase()
        );
        if (!exists) {
          changed = true;
          current.push({ ...fx, passwordHash: fixedHash });
        } else {
          // asegura el flag fixed y hash
          current = current.map((m) => {
            if ((m.email || "").toLowerCase() === fx.email.toLowerCase()) {
              return {
                ...m,
                fixed: true,
                passwordHash: m.passwordHash || fixedHash,
                nombre: m.nombre || fx.nombre,
              };
            }
            return m;
          });
        }
      });

      // 2) Parche: completa email si faltaba (maestros antiguos)
      const patched = current.map((m) =>
        m.email ? m : { ...m, email: toEmailFromName(m.nombre) }
      );
      if (changed || JSON.stringify(patched) !== JSON.stringify(current)) {
        saveMaestros(patched);
        setMaestros(patched);
      } else {
        setMaestros(current);
      }
    })();
  }, []);

  const asignadas = (id) => materias.filter(m => m.maestroId === id).length;

  /* ===================== CREAR ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.nombre.trim()) return toast.error("Escribe el nombre del maestro");
    if (form.email && !/.+@.+\..+/.test(form.email)) return toast.error("Email no válido");
    if (!form.password || form.password.length < 6) return toast.error("Contraseña mínima de 6 caracteres");

    const passwordHash = await sha256(form.password);
    const nuevo = {
      id: uid(),
      nombre: form.nombre.trim(),
      email:  form.email.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
      fixed: false,
    };

    const next = [...maestros, nuevo];
    setMaestros(next);
    saveMaestros(next);
    setForm({ nombre: "", email: "", password: "" });
    setShowPassword(false);
    toast.success("Maestro creado");
  };

  /* ===================== EDITAR ===================== */
  const isFixedItem = (m) =>
    m.fixed === true ||
    ["jorge@umg.edu", "stephanie@umg.edu"].includes((m.email || "").toLowerCase());

  const startEdit = (m) => {
    if (isFixedItem(m)) {
      toast.info("Esta es una cuenta fija; no se puede editar.");
      return;
    }
    setEditingId(m.id);
    setForm({ nombre: m.nombre, email: m.email || "", password: "" });
    setShowPassword(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: "", email: "", password: "" });
    setShowPassword(false);
  };

  const saveEdit = async () => {
    if (!form.nombre || !form.nombre.trim()) return toast.error("Escribe el nombre del maestro");
    if (form.email && !/.+@.+\..+/.test(form.email)) return toast.error("Email no válido");

    const next = await Promise.all(
      maestros.map(async (m) => {
        if (m.id !== editingId) return m;
        if (isFixedItem(m)) return m; // protección extra
        const updated = {
          ...m,
          nombre: form.nombre.trim(),
          email:  form.email.trim(),
        };
        if (form.password) {
          if (form.password.length < 6) {
            toast.error("La nueva contraseña debe tener al menos 6 caracteres");
            throw new Error("short password");
          }
          updated.passwordHash = await sha256(form.password);
        }
        return updated;
      })
    ).catch(() => null);

    if (!next) return; // hubo error en Promise.all

    setMaestros(next);
    saveMaestros(next);
    setEditingId(null);
    setForm({ nombre: "", email: "", password: "" });
    setShowPassword(false);
    toast.success("Maestro actualizado");
  };

  /* ===================== ELIMINAR ===================== */
  const remove = (m) => {
    if (isFixedItem(m)) {
      return toast.error("Cuenta fija: no se puede eliminar.");
    }
    const count = asignadas(m.id);
    if (count > 0) return toast.error(`No puedes eliminar: tiene ${count} materia(s) asignada(s). Reasigna primero.`);
    const next = maestros.filter(x => x.id !== m.id);
    setMaestros(next);
    saveMaestros(next);
    toast.success("Maestro eliminado");
  };

  const filtered = maestros.filter((m) =>
    (m.nombre + " " + (m.email || "")).toLowerCase().includes(search.toLowerCase())
  );

  /* ===================== UI ===================== */
  const Inputs = (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring focus:ring-slate-200"
          placeholder="Ana González"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          onKeyDown={(e) => editingId && e.key === "Enter" && e.preventDefault()}
        />
      </div>

      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-1">Gmail</label>
        <input
          type="email"
          className="w-full rounded-xl border px-3 py-2 placeholder-slate-400"
          placeholder="ana@gmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={(e) => editingId && e.key === "Enter" && e.preventDefault()}
        />
      </div>

      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-1">
          Contraseña {editingId && <span className="text-xs text-slate-500">(opcional al editar)</span>}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-xl border px-3 py-2 pr-16"
            placeholder={editingId ? "Deja en blanco para no cambiar" : "mínimo 6 caracteres"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => editingId && e.key === "Enter" && e.preventDefault()}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Crear Maestro</h1>
        <p className="text-slate-500">Los maestros creados aquí aparecen en el selector de la pantalla de crear materias.</p>
      </header>

      {/* ===== CREAR ===== */}
      {!editingId ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4" noValidate>
          {Inputs}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setForm({ nombre: "", email: "", password: "" })}
              className="px-4 py-2 rounded-xl border hover:bg-slate-50"
            >
              Limpiar
            </button>
          </div>
        </form>
      ) : (
        /* ===== EDITAR (sin <form>) ===== */
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          {Inputs}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={saveEdit}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-xl border hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Maestros</h2>
        <input
          className="rounded-xl border px-3 py-2 w-64"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((m) => {
          const count = asignadas(m.id);
          const initial = m.nombre?.trim()?.[0]?.toUpperCase() || "👩‍🏫";
          const fixed = isFixedItem(m);

          return (
            <article key={m.id} className={`rounded-2xl border shadow-sm p-5 hover:shadow-md transition bg-white`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 grid place-items-center text-lg">
                  {initial}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {m.nombre} {fixed && <span className="text-xs text-slate-500">(fija)</span>}
                  </p>
                  {m.email && <p className="text-sm text-slate-600">{m.email}</p>}
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                    Materias asignadas: {count}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  className={`px-3 py-1 rounded-lg text-sm ${
                    fixed ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 text-white hover:opacity-90"
                  }`}
                  onClick={() => !fixed && startEdit(m)}
                  disabled={fixed}
                  title={fixed ? "Cuenta fija; no editable" : "Editar"}
                >
                  Editar
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm ${
                    fixed
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : count > 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                  onClick={() => !fixed && count === 0 && remove(m)}
                  disabled={fixed || count > 0}
                  title={
                    fixed
                      ? "Cuenta fija; no eliminable"
                      : count > 0
                        ? "Reasigna sus materias antes de eliminar"
                        : "Eliminar"
                  }
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 && <div className="text-center text-slate-500 py-16">No hay maestros aún.</div>}
    </div>
  );
}
