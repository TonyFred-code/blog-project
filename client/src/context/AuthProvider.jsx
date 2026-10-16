import api, {
  refreshAccessToken,
  setAccessToken,
  setSessionExpiredHandler,
} from "@/lib/axios.js";
import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      try {
        const data = await refreshAccessToken();

        if (!ignore) setUser(data.user);
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback((user, token) => {
    setAccessToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const value = { user, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export default AuthProvider;
