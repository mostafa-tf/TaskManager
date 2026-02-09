import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem("token")) {
    return children;
  }
  return <Navigate to="/login" replace />;
};
export default ProtectedRoute;
