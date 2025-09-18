// src/director/crearusuario/CrearUsuario.jsx
import { useEffect, useState } from "react";
import { listRoles } from "../../services/rolesService";
import { crearUsuario } from "../../services/usuariosService";

export default function CrearUsuario() {
  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
    confirmar: "",
    id_rol: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await listRoles();
        // Normaliza: { id, nombre }
        const norm = (Array.isArray(r) ? r : r?.data || []).map((x) => ({
          id: x.id ?? x._id ?? x.Id ?? x.nombre,
          nombre: x.nombre ?? x.name ?? String(x.id ?? x._id ?? x.Id ?? x.nombre),
        }));
        setRoles(norm);
      } catch (e) {
        setMsg(`❌ ${e.message || "No se pudieron cargar los roles"}`);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validar = () => {
    if (!form.correo.trim()) return "El correo es obligatorio.";
    if (!/\S+@\S+\.\S+/.test(form.correo)) return "Correo inválido.";
    if (!form.contrasena) return "La contraseña es obligatoria.";
    if (form.contrasena.length < 6) return "Mínimo 6 caracteres de contraseña.";
    if (form.contrasena !== form.confirmar) return "Las contraseñas no coinciden.";
    if (!form.id_rol) return "Selecciona un rol.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const err = validar();
    if (err) return setMsg(`❌ ${err}`);

    setLoading(true);
    try {
      await crearUsuario({
        correo: form.correo.trim(),
        contrasena: form.contrasena, // si tu API usa "password", cámbialo aquí
        id_rol: form.id_rol,         // si tu API usa "rolId", cámbialo aquí
      });
      setMsg("✅ Usuario creado correctamente");
      setForm({ correo: "", contrasena: "", confirmar: "", id_rol: "" });
    } catch (e) {
      setMsg(`❌ ${e.message || "Error al crear usuario"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Agregar Usuario</h1>
      {msg && (
        <div
          className={`mb-4 text-sm px-3 py-2 rounded ${
            msg.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {msg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <label className="text-sm font-medium">Correo</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={onChange}
            placeholder="usuario@correo.com"
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <div className="mt-1 relative">
              <input
                type={showPwd ? "text" : "password"}
                name="contrasena"
                value={form.contrasena}
                onChange={onChange}
                className="w-full border rounded px-3 py-2 pr-9 focus:outline-none focus:ring focus:ring-indigo-200"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label="Mostrar/Ocultar contraseña"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Confirmar</label>
            <input
              type={showPwd ? "text" : "password"}
              name="confirmar"
              value={form.confirmar}
              onChange={onChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Rol</label>
          <select
            name="id_rol"
            value={form.id_rol}
            onChange={onChange}
            className="mt-1 w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-indigo-200"
            required
          >
            <option value="">Seleccione…</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2">
          <button
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
