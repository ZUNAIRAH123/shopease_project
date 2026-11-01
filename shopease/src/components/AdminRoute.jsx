import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only users with the "admin" role can see the pages inside this component.
// Everyone else is redirected to the home page.
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
