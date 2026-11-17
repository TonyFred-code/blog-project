import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const currentPath = encodeURIComponent(location.pathname + location.search);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirectTo=${currentPath}`}
        state={{ fromProtected: true }}
        replace
      />
    );
  }

  return children;
}

export { ProtectedRoute };
