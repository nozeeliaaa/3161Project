import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [authError, setAuthError] = useState("");

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    setAuthError("");
    const data = await loginRequest(credentials);
    const nextUser = {
      id: data.user_id,
      user_id: data.user_id,
      username: credentials.username,
      role: data.role
    };

    setStoredSession(data.access_token, nextUser);
    setToken(data.access_token);
    setUser(nextUser);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError("");
    return registerRequest(payload);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role,
      isAuthenticated: Boolean(token),
      authError,
      setAuthError,
      login,
      register,
      logout
    }),
    [authError, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
