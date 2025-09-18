// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./router/routes.jsx";

export default function App() {
  return (
    <Routes>
      {routes.map((r, i) => (
        <Route key={i} path={r.path} element={r.element}>
          {r.children?.map((c, j) => (
            <Route
              key={`${i}-${j}`}
              index={c.index}
              path={c.path}
              element={c.element}
            />
          ))}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
