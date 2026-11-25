import api, {
  clearAuthSession,
  restoreSession,
  setAuthSession,
  setSessionExpiredHandler,
} from "@/lib/axios.js";
import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { toast } from "sonner";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        const data = await restoreSession();

        if (!ignore) setUser(data.user);
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setUser(null);
          clearAuthSession();
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");

    channel.onmessage = async (event) => {
      if (event.data.type === "AUTH") setUser(event.data.user);
    };

    return () => channel.close();
  }, []);

  const login = useCallback((user, token) => {
    setAuthSession(user, token);
    setUser(user);
    const channel = new BroadcastChannel("auth_channel");

    channel.postMessage({ type: "AUTH", user });
    toast.success("Login successful! Welcome back!");
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
      const channel = new BroadcastChannel("auth_channel");

      channel.postMessage({ type: "AUTH", user: null });
      toast.success("User logged out. Come back soon.");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUser(null);
      clearAuthSession();
    }
  }, []);

  const value = { user, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export default AuthProvider;
