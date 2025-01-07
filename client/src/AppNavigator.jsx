import { BrowserRouter, Routes, Route } from "react-router";
import { authRoutes, nonAuthRoutes, publicRoutes } from "./services/routes";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = [...publicRoutes, ...nonAuthRoutes, ...authRoutes];

export function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
