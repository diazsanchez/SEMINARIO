// src/router/alumno.routes.jsx
import { Navigate } from "react-router-dom";
import Protected from "./Protected.jsx";

import Alumno from "../alumno/alumno.jsx";
import Dashboard from "../alumno/dashboard/dashboard.jsx";
import Materias from "../alumno/materias/materias.jsx";
import Perfilestu from "../alumno/perfilestu/perfiles.jsx";
import Quizes from "../alumno/quizes/quizes.jsx";
import Rankings from "../alumno/rankings/rankings.jsx";
import Tienda from "../alumno/tienda/tienda.jsx";

export const alumnoRoutes = [
  {
    path: "/alumno",
    element: (
      <Protected allow="alumno">
        <Alumno />
      </Protected>
    ),
    children: [
      // Al entrar a /alumno, mandar por defecto a /alumno/dashboard
      { index: true, element: <Navigate to="dashboard" replace /> },

      { path: "dashboard", element: <Dashboard /> },
      { path: "perfil",    element: <Perfilestu /> },
      { path: "materias",  element: <Materias /> },
      { path: "quizes",    element: <Quizes /> },
      { path: "rankings",  element: <Rankings /> },
      { path: "tienda",    element: <Tienda /> },
    ],
  },
];
