import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, registerApi, logoutApi } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fi_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch {
        // ignore parsing errors
      }
    }
  }, []);

  const persist = (next) => {
    localStorage.setItem("fi_auth", JSON.stringify(next));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      console.log("Login API response:", res);
      const next = {
        user: res.data?.user || res.user || null,
        token: res.data?.token || res.token || null,
      };
      setUser(next.user);
      setToken(next.token);
      persist(next);
      console.log("User state after login:", next.user);
      return next;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = "admin") => {
    setLoading(true);
    try {
      const res = await registerApi({ name, email, password, role });
      console.log("Register API response:", res);
      const next = {
        user: res.data?.user || res.user || { name, email },
        token: res.data?.token || res.token || null,
      };
      setUser(next.user);
      setToken(next.token);
      persist(next);
      console.log("User state after register:", next.user);
      return next;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutApi(token);
      }
    } catch (e) {
      console.error("Logout error:", e);
      // ignore network/auth errors on logout to ensure client clears state
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("fi_auth");
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
