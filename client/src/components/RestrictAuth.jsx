import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";

function RestrictAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={decodeURIComponent(redirectTo)} replace />;
  }

  return children;
}

export default RestrictAuth;
