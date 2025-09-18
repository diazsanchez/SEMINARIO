import { Navigate } from "react-router-dom";
import Maestro from "../maestro/maestro.jsx";
import Protected from "../router/Protected.jsx";

// Importa las vistas del maestro
import Dashboard from "../";
import Grado from "../maestro/grado/grado.jsx";
import Materia from "../maestro/materia/materia.jsx";
import Quiz from "../maestro/quiz/quiz.jsx";
import Ranking from "../maestro/ranking/ranking.jsx";

export const maestroRoutes = [
  {
    path: "/maestro",
    element: (
      <Protected allow="maestro">
        <Maestro />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> }, // default seguro
      { path: "dashboard", element: <Dashboard /> },
      { path: "grado",     element: <Grado /> },
      { path: "materia",   element: <Materia /> },
      { path: "quiz",      element: <Quiz /> },
      { path: "ranking",   element: <Ranking /> },
    ],
  },
];
