// src/miperfil/miperfil.jsx
export default function MiPerfil() {
  const user = {
    nombre: "Juan Pérez",
    email: "juanperez@correo.com",
    rol: localStorage.getItem("role") || "desconocido",
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 grid place-items-center text-2xl">
          👤
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.nombre}</h1>
          <p className="text-slate-600 text-sm">{user.email}</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
            Rol: {user.rol}
          </span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="grid sm:grid-cols-2 gap-4">
        <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90">
          Editar perfil
        </button>
        <button className="px-4 py-2 rounded-lg bg-white border hover:bg-slate-50">
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
}
