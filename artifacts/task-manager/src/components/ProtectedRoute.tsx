import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (localStorage.getItem("token")) {
    return <>{children}</>;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
