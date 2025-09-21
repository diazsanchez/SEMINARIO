import { Navigate } from "react-router-dom";
import Protected from "./Protected.jsx"; // Ajuste para importar Protected desde la misma carpeta

// Importa las vistas del maestro desde src/maestro/
import Maestro from "../maestro/Maestro.jsx";
import Dashboard from "../maestro/dashboard/dashboard.jsx";
import Materia from "../maestro/materia/Materia.jsx";

export const maestroRoutes = [
  {
    path: "/maestro",
    element: (
      <Protected allow="maestro">
        <Maestro />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> }, // Ruta predeterminada
      { path: "dashboard", element: <Dashboard /> },
      { path: "materia/lista", element: <Materia /> }, // Ajuste para coincidir con NavLink
    ],
  },
];