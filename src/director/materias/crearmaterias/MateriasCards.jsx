import { useState } from "react";

/** Paleta para el panel izquierdo (gradiente) */
const PALETTES = [
  "bg-gradient-to-r from-violet-500 to-indigo-600",
  "bg-gradient-to-r from-emerald-500 to-teal-600",
  "bg-gradient-to-r from-amber-500 to-orange-600",
  "bg-gradient-to-r from-rose-500 to-pink-600",
  "bg-gradient-to-r from-sky-500 to-blue-600",
];

export default function MateriasCards({
  materias,
  onAskDelete,
  onUpdateName,
  onUpdateTemas,
  onSwap,
  onDragEnd,
}) {
  const [editNombre, setEditNombre] = useState({});
  const [editing, setEditing] = useState({});
  const [temaNuevo, setTemaNuevo] = useState({});
  const [temaEdit, setTemaEdit] = useState({ id: null, idx: -1, value: "" });

  const idOf = (m) => m._id || m.id || m.Id || m.nombre;

  const handleDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", id); } catch {}
  };

  if (!materias?.length) return <div className="text-sm text-slate-500">Aún no hay materias.</div>;

  return (
    <div className="space-y-6">
      {materias.map((m, i) => {
        const id = idOf(m);
        const nom = m.nombre || m.Name || id;
        const temas = Array.isArray(m.temas) ? m.temas : [];
        const gradient = PALETTES[i % PALETTES.length];
        const isEditing = !!editing[id];
        const isEditingTema = temaEdit.id === id;

        return (
          <div
            key={id}
            className="rounded-2xl border shadow-sm bg-white overflow-hidden"
            draggable
            onDragStart={(e) => handleDragStart(e, id)}
            onDragOver={(e) => {
              e.preventDefault();
              const overId = id;
              const sourceId = e.dataTransfer.getData("text/plain");
              if (sourceId && sourceId !== overId) onSwap(sourceId, overId);
            }}
            onDragEnd={onDragEnd}
          >
            <div className="flex flex-col md:flex-row">
              {/* Panel izquierdo */}
              <div className={`w-full md:w-80 p-5 ${gradient} text-white flex flex-col gap-4`}>
                <div className="flex items-start gap-3">
                  <span className="select-none text-2xl leading-none cursor-grab mt-1" title="Arrastrar">⋮⋮</span>
                  {isEditing ? (
                    <input
                      value={editNombre[id] ?? nom}
                      onChange={(e) => setEditNombre((s) => ({ ...s, [id]: e.target.value }))}
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 backdrop-blur placeholder:text-white/70 focus:outline-none"
                      placeholder="Nombre de la materia"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-xl font-semibold">{nom}</h3>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          const nuevo = (editNombre[id] ?? "").trim();
                          if (nuevo) onUpdateName(id, nuevo);
                          setEditing((s) => ({ ...s, [id]: false }));
                        }}
                        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditing((s) => ({ ...s, [id]: false }))}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditing((s) => ({ ...s, [id]: true }));
                          setEditNombre((s) => ({ ...s, [id]: nom }));
                        }}
                        className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30"
                      >
                        Editar
                      </button>
                      <button onClick={() => onAskDelete(m)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Panel derecho */}
              <div className="flex-1 p-5">
                {temas.length ? (
                  <div className="flex flex-wrap gap-2.5">
                    {temas.map((t, idx) => (
                      <div key={idx}>
                        {isEditingTema && temaEdit.idx === idx ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              value={temaEdit.value}
                              onChange={(e) => setTemaEdit((x) => ({ ...x, value: e.target.value }))}
                              className="border rounded-lg px-3 py-1.5"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                const nuevo = temaEdit.value.trim();
                                if (!nuevo) return;
                                const arr = temas.slice();
                                arr[idx] = nuevo;
                                onUpdateTemas(id, arr);
                                setTemaEdit({ id: null, idx: -1, value: "" });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setTemaEdit({ id: null, idx: -1, value: "" })}
                              className="px-3 py-1.5 rounded-lg border hover:bg-slate-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 border flex items-center gap-2">
                            {t}
                            <button
                              className="text-slate-600 hover:text-slate-800 text-xs"
                              title="Editar tema"
                              onClick={() => setTemaEdit({ id, idx, value: t })}
                            >
                              ✎
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 text-xs"
                              title="Quitar tema"
                              onClick={() => onUpdateTemas(id, temas.filter((x) => x !== t))}
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 mb-2">Sin temas</div>
                )}

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
                  <input
                    value={temaNuevo[id] ?? ""}
                    onChange={(e) => setTemaNuevo((s) => ({ ...s, [id]: e.target.value }))}
                    placeholder="Nuevo tema…"
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = (temaNuevo[id] || "").trim();
                      if (!v) return;
                      if (temas.includes(v)) return;
                      onUpdateTemas(id, [...temas, v]);
                      setTemaNuevo((s) => ({ ...s, [id]: "" }));
                    }}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:opacity-90"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
