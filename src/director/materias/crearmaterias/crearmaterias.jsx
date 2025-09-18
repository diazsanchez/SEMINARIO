import { useEffect, useState } from "react";
import { toast } from "sonner";

import MateriasCards from "./MateriasCards.jsx";
import MateriasForm from "./MateriasForm.jsx";

// 👇 usa el servicio en PLURAL
import {
  actualizarMateria,
  crearMateria,
  eliminarMateria,
  listarMaterias,
} from "../../../services/materiaService";

export default function CrearMaterias() {
  // ===== Form crear =====
  const [nombre, setNombre] = useState("");
  const [temas, setTemas] = useState([""]);
  const [saving, setSaving] = useState(false);

  // ===== Lista =====
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== Modal eliminar =====
  const [confirm, setConfirm] = useState({ open: false, id: null, nombre: "" });

  const idOf = (x) => x._id || x.id || x.Id;

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await listarMaterias();
      const arr = Array.isArray(data) ? data : data?.data || [];
      arr.sort((a, b) => {
        const ao = typeof a.orden === "number" ? a.orden : 999999;
        const bo = typeof b.orden === "number" ? b.orden : 999999;
        return ao - bo;
      });
      setLista(arr);
    } catch (e) {
      toast.error(e.message || "Error cargando materias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // ===== handlers form =====
  const addTema = () => setTemas((t) => [...t, ""]);
  const removeTema = (idx) => setTemas((t) => t.filter((_, i) => i !== idx));
  const changeTema = (idx, v) => setTemas((t) => t.map((x, i) => (i === idx ? v : x)));

  const submitCrear = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return toast.error("El nombre de la materia es obligatorio.");

    // ✅ chequeo local (case-insensitive) para evitar duplicados
    const yaExiste = lista.some(
      (m) => (m.nombre || "").trim().toLowerCase() === nombreLimpio.toLowerCase()
    );
    if (yaExiste) return toast.error("La materia ya existe");

    const temasLimpios = Array.from(new Set(temas.map((t) => t.trim()).filter(Boolean)));

    setSaving(true);
    try {
      await crearMateria({ nombre: nombreLimpio, temas: temasLimpios });
      toast.success("Materia creada correctamente");
      setNombre("");
      setTemas([""]);
      await cargar();
    } catch (err) {
      toast.error(err.message || "No se pudo crear la materia");
    } finally {
      setSaving(false);
    }
  };

  // ===== acciones de tarjetas =====
  const onUpdateName = async (id, nuevo) => {
    const nombreLimpio = (nuevo || "").trim();
    if (!nombreLimpio) return toast.error("El nombre no puede estar vacío");

    // ✅ evita renombrar a un nombre ya usado
    const yaExiste = lista.some(
      (m) =>
        (m._id || m.id || m.Id) !== id &&
        (m.nombre || "").trim().toLowerCase() === nombreLimpio.toLowerCase()
    );
    if (yaExiste) return toast.error("La materia ya existe");

    try {
      await actualizarMateria(id, { nombre: nombreLimpio });
      toast.success("Nombre actualizado");
      await cargar();
    } catch (e) {
      toast.error(e.message || "No se pudo actualizar el nombre");
    }
  };

  const onUpdateTemas = async (id, nuevosTemas) => {
    try {
      await actualizarMateria(id, { temas: nuevosTemas });
      toast.success("Temas actualizados");
      await cargar();
    } catch (e) {
      toast.error(e.message || "No se pudo actualizar los temas");
    }
  };

  const onAskDelete = (m) => {
    setConfirm({ open: true, id: idOf(m), nombre: m.nombre || "esta materia" });
  };

  const eliminarConfirmado = async () => {
    try {
      await eliminarMateria(confirm.id);
      toast.success("Materia eliminada");
      setConfirm({ open: false, id: null, nombre: "" });
      await cargar();
    } catch (e) {
      toast.error(e.message || "No se pudo eliminar");
    }
  };

  // ===== drag & drop: reordenar en pantalla =====
  const swapInState = (sourceId, overId) => {
    setLista((curr) => {
      const s = curr.findIndex((x) => idOf(x) === sourceId);
      const t = curr.findIndex((x) => idOf(x) === overId);
      if (s < 0 || t < 0 || s === t) return curr;
      const next = curr.slice();
      const [m] = next.splice(s, 1);
      next.splice(t, 0, m);
      return next;
    });
  };

  // Si tu BD soporta 'orden', se persiste silenciosamente
  const persistOrderIfSupported = async () => {
    const supports = lista.some((x) => typeof x.orden === "number");
    if (!supports) return;
    try {
      await Promise.allSettled(
        lista.map((m, idx) => actualizarMateria(idOf(m), { orden: idx }))
      );
    } catch {}
  };

  // ===== UI =====
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Materias</h1>
      <p className="text-slate-500 mb-6">Crea, edita, organiza temas y reordena tarjetas arrastrando.</p>

      <MateriasForm
        nombre={nombre}
        temas={temas}
        onNombreChange={setNombre}
        onTemaChange={changeTema}
        onTemaAdd={addTema}
        onTemaRemove={removeTema}
        onSubmit={submitCrear}
        saving={saving}
      />

      {loading ? (
        <div className="text-sm text-slate-500">Cargando…</div>
      ) : (
        <MateriasCards
          materias={lista}
          onAskDelete={onAskDelete}
          onUpdateName={onUpdateName}
          onUpdateTemas={onUpdateTemas}
          onSwap={swapInState}
          onDragEnd={persistOrderIfSupported}
        />
      )}

      {/* Modal eliminar */}
      {confirm.open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setConfirm({ open: false, id: null, nombre: "" })}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-2xl">⚠️</div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">¿Eliminar materia?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  ¿Estás seguro de eliminar <span className="font-medium">“{confirm.nombre}”</span>? Esta acción no se puede deshacer y
                  <span className="font-medium"> podría afectar el rendimiento</span> si existen registros relacionados.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-lg border hover:bg-slate-50" onClick={() => setConfirm({ open: false, id: null, nombre: "" })}>
                Cancelar
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white" onClick={eliminarConfirmado}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
