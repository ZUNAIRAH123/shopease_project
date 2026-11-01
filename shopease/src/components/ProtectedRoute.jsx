import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only logged-in users can see the pages inside this component.
// Everyone else is sent to the login page (and returned here after logging in).
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
