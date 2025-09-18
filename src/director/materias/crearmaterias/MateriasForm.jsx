
/** Form de creación (presentacional) */
export default function MateriasForm({
  nombre,
  temas,
  onNombreChange,
  onTemaChange,
  onTemaAdd,
  onTemaRemove,
  onSubmit,
  saving,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-2xl shadow p-6 mb-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Nombre de la materia</label>
          <input
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring focus:ring-slate-200"
            placeholder="Matemáticas, Lenguaje, Ciencias…"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Temas iniciales (opcional)</label>
            <button type="button" onClick={onTemaAdd} className="px-3 py-1.5 rounded-lg border hover:bg-slate-50">
              + Añadir tema
            </button>
          </div>

          <div className="space-y-2">
            {temas.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={t}
                  onChange={(e) => onTemaChange(i, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder={`Tema #${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => onTemaRemove(i)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
