import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

function RestrictAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RestrictAuth;
