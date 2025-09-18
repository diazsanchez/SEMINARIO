// src/router/routes.jsx
import Bienvenida from "../bienvenida/Bienvenida.jsx";
import Login from "../login/Login.jsx";

import { alumnoRoutes } from "./alumno.routes.jsx";
import { directorRoutes } from "./director.routes.jsx";
import { maestroRoutes } from "./maestro.routes.jsx";

import GuestOnly from "./GuestOnly.jsx";

export const routes = [
  { path: "/", element: <Bienvenida /> },

  { element: <GuestOnly />, children: [{ path: "/login", element: <Login /> }] },

  // SIN Protected global. Deja que cada set ya protegido maneje su guard.
  ...alumnoRoutes,
  ...maestroRoutes,
  ...directorRoutes,

  // Puedes dejar tu Bienvenida si quieres, pero para depurar es mejor ver 404:
  { path: "*", element: <div style={{padding:16}}>404 - Ruta no encontrada</div> },
];
