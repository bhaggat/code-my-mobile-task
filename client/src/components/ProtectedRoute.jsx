import { authRoutes, publicRoutes } from "../../../server/src/constants/routes";
import { useUser } from "../context/UserContext";
import { matchRoutes, Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const user = useUser();
  const location = useLocation();
  const isProtected = matchRoutes(authRoutes, location.pathname);
  const isPublic = matchRoutes(publicRoutes, location.pathname);
  if (!isPublic) {
    if (isProtected && !user?.token) {
      return <Navigate to="signin" />;
    } else if (!isProtected && user?.token) {
      return <Navigate to="home" />;
    }
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}
