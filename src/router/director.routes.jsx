// director.routes.jsx
import { Navigate } from "react-router-dom";
import Director from "../director/director.jsx";
import Protected from "./Protected.jsx";

import Alumnos from "../director/alumnos/alumnos.jsx";
import CrearMaestro from "../director/maestro/crearmaestro/crearmaestro.jsx";
import CrearMaterias from "../director/materias/crearmaterias/crearmaterias.jsx";
import MisMaterias from "../director/materias/mismaterias/mismaterias.jsx";
import MiPerfil from "../director/miperfil/miperfil.jsx";
import Quiz from "../director/quiz/quiz.jsx";
import Ranking from "../director/ranking/ranking.jsx";

// 🔵 NUEVO: importar la vista Crear Usuario
import CrearUsuario from "../director/crearusuario/crearusuario.jsx";

export const directorRoutes = [
  {
    path: "/director",
    element: (
      <Protected allow="director">
        <Director />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="perfil" replace /> }, // default
      { path: "materias/crearmaterias", element: <CrearMaterias /> },
      { path: "materias/mismaterias",   element: <MisMaterias /> },
      { path: "maestros/crearmaestro",  element: <CrearMaestro /> },

      // 🔵 NUEVO: ruta para la vista Crear Usuario
      { path: "usuarios/crear", element: <CrearUsuario /> },

      { path: "alumnos", element: <Alumnos /> },
      { path: "quiz",    element: <Quiz /> },
      { path: "ranking", element: <Ranking /> },
      { path: "perfil",  element: <MiPerfil /> },
    ],
  },
];
