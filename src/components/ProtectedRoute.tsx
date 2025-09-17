import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "@mantine/core";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname.startsWith("/dashboard/admin") && user.email !== "utsab@wcpsb.com") {
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
