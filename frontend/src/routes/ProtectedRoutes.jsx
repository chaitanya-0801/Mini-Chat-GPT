import { Outlet, Navigate, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";
export default function ProtectedRoutes() {
  const { token } = useUser();
  const location = useLocation();
  return token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location.pathname + location.search }}
      replace
    />
  );
}
