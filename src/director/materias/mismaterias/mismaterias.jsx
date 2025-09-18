import { useEffect, useMemo, useState } from "react";

const LS_KEY_MATERIAS = "materias";
const LS_KEY_MAESTROS = "maestros";
const LS_KEY_ORDEN    = "materiasOrden"; // { "<maestroId>|<grado>": [materiaId,...] }

const GRADOS = {
  primero: { label: "Primero Básico", emoji: "🧒", grad: "from-violet-500 to-fuchsia-600" },
  segundo: { label: "Segundo Básico", emoji: "👧", grad: "from-teal-500 to-emerald-600" },
  tercero: { label: "Tercero Básico", emoji: "🎓", grad: "from-orange-500 to-amber-600" },
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : fallback;
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getCurrentEmail() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.email) return String(u.email).toLowerCase();
  } catch {}
  const e = localStorage.getItem("email");
  return e ? e.toLowerCase() : "";
}
const keyOrden = (maestroId, grado) => `${maestroId}|${grado}`;

export default function MisMaterias() {
  const allMaterias = useMemo(() => loadJSON(LS_KEY_MATERIAS, []), []);
  const maestros    = useMemo(() => loadJSON(LS_KEY_MAESTROS, []), []);
  const [ordenes, setOrdenes] = useState(() => loadJSON(LS_KEY_ORDEN, {}));

  const myEmail = getCurrentEmail();
  const me = maestros.find((m) => (m.email || "").trim().toLowerCase() === myEmail);

  const [listas, setListas] = useState({ primero: [], segundo: [], tercero: [] });

  useEffect(() => {
    if (!me) return;
    const base = { primero: [], segundo: [], tercero: [] };

    for (const mat of allMaterias) {
      if (mat.maestroId === me.id && base[mat.grado]) base[mat.grado].push(mat);
    }

    const next = { ...base };
    (["primero", "segundo", "tercero"]).forEach((g) => {
      const key = keyOrden(me.id, g);
      const orderIds = ordenes[key] || [];
      if (orderIds.length) {
        const map = new Map(base[g].map((m) => [m.id, m]));
        const ordered = orderIds.map((id) => map.get(id)).filter(Boolean);
        const rest = base[g].filter((m) => !orderIds.includes(m.id));
        next[g] = [...ordered, ...rest];
      } else {
        next[g] = [...base[g]].sort(
          (a, b) =>
            (new Date(b.createdAt || 0)).getTime() -
              (new Date(a.createdAt || 0)).getTime() ||
            a.nombre.localeCompare(b.nombre)
        );
      }
    });
    setListas(next);
  }, [me, allMaterias, ordenes]);

  // ----- Drag & Drop -----
  const [drag, setDrag] = useState({ id: null, grado: null });

  const onDragStart = (grado, id) => (e) => {
    setDrag({ id, grado });
    e.dataTransfer.effectAllowed = "move";
  };

  // ¡clave! cancelar y detener propagación en cualquier dragover
  const onDragOverStop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const moveInArray = (arr, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return arr;
    const copy = arr.slice();
    const [item] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, item);
    return copy;
  };

  const onDropOnItem = (grado, targetId) => (e) => {
    e.preventDefault();
    e.stopPropagation(); // <- evita que el contenedor lo mande al final
    if (!drag.id || drag.grado !== grado) return;

    setListas((prev) => {
      const list = prev[grado];
      const from = list.findIndex((m) => m.id === drag.id);
      const to   = list.findIndex((m) => m.id === targetId);
      if (from < 0 || to < 0) return prev;

      const reord = moveInArray(list, from, to);
      const next  = { ...prev, [grado]: reord };

      if (me) {
        const key = keyOrden(me.id, grado);
        const newOrdenes = { ...ordenes, [key]: reord.map((m) => m.id) };
        setOrdenes(newOrdenes);
        saveJSON(LS_KEY_ORDEN, newOrdenes);
      }
      return next;
    });
    setDrag({ id: null, grado: null });
  };

  // Drop en el panel (fondo) => al final
  const onDropAtEnd = (grado) => (e) => {
    e.preventDefault();
    e.stopPropagation(); // <- importante
    if (!drag.id || drag.grado !== grado) return;

    setListas((prev) => {
      const list = prev[grado];
      const from = list.findIndex((m) => m.id === drag.id);
      if (from < 0) return prev;

      const reord = moveInArray(list, from, list.length - 1);
      const next  = { ...prev, [grado]: reord };

      if (me) {
        const key = keyOrden(me.id, grado);
        const newOrdenes = { ...ordenes, [key]: reord.map((m) => m.id) };
        setOrdenes(newOrdenes);
        saveJSON(LS_KEY_ORDEN, newOrdenes);
      }
      return next;
    });
    setDrag({ id: null, grado: null });
  };

  const resetOrden = (grado) => {
    if (!me) return;
    const key = keyOrden(me.id, grado);
    const newOrdenes = { ...ordenes };
    delete newOrdenes[key];
    setOrdenes(newOrdenes);
    saveJSON(LS_KEY_ORDEN, newOrdenes);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis materias</h1>
          <p className="text-slate-500">
            {me
              ? `Mostrando las materias asignadas a: ${me.nombre} (${me.email})`
              : "Tu usuario no aparece como maestro. Pídele al director que te asigne materias."}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(GRADOS).map(([grado, meta]) => {
          const items = listas[grado] || [];
          const hayOrden = me && (ordenes[keyOrden(me.id, grado)]?.length > 0);

          return (
            <article key={grado} className="rounded-2xl p-1 bg-gradient-to-br from-slate-200 to-slate-100">
              <div
                className={`rounded-2xl p-6 min-h-[240px] text-white bg-gradient-to-br ${meta.grad}`}
                onDragOver={onDragOverStop}   // <- permitir drop en panel
                onDrop={onDropAtEnd(grado)}   // <- al final si sueltas en fondo
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{meta.emoji}</div>
                    <div>
                      <h2 className="text-xl font-bold">{meta.label}</h2>
                      <p className="text-white/90 text-sm">
                        {items.length > 0
                          ? `Tienes ${items.length} materia${items.length > 1 ? "s" : ""} asignada${items.length > 1 ? "s" : ""}.`
                          : "Aún no tienes materias asignadas en este grado."}
                      </p>
                    </div>
                  </div>

                  {me && (
                    <button
                      type="button"
                      onClick={() => resetOrden(grado)}
                      className={`text-xs px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition ${
                        hayOrden ? "opacity-100" : "opacity-50"
                      }`}
                      title="Reiniciar orden"
                    >
                      Reiniciar
                    </button>
                  )}
                </div>

                {/* Lista draggable */}
                <div className="mt-4 space-y-3">
                  {items.map((mat) => (
                    <div
                      key={mat.id}
                      className={`bg-white/15 backdrop-blur rounded-xl px-4 py-3 cursor-move select-none transition
                         ${drag.id === mat.id ? "ring-2 ring-white/80" : "hover:bg-white/20"}`}
                      draggable
                      onDragStart={onDragStart(grado, mat.id)}
                      onDragOver={onDragOverStop}         // <- permitir drop sobre el ítem
                      onDrop={onDropOnItem(grado, mat.id)} // <- reordenar aquí
                      title="Arrástrame para cambiar el orden"
                    >
                      <div className="flex items-start gap-3" onDragOver={onDragOverStop}>
                        <div className="pt-0.5 text-white/80 select-none">⋮⋮</div>
                        <div className="flex-1">
                          <p className="font-semibold">{mat.nombre}</p>
                          {mat.createdAt && (
                            <p className="text-xs text-white/80">
                              Asignada: {new Date(mat.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {me && Object.values(listas).every((arr) => arr.length === 0) && (
        <div className="text-center text-slate-500 py-12">
          No tienes materias asignadas todavía.
        </div>
      )}
    </div>
  );
}
