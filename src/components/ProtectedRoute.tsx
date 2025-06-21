import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname.startsWith("/dashboard/admin") && user.email !== "utsab@wcpsb.com") {
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
