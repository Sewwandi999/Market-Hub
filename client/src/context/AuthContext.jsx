import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("markethub_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("markethub_token")));

  useEffect(() => {
    const token = localStorage.getItem("markethub_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api("/auth/me")
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("markethub_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("markethub_token");
        localStorage.removeItem("markethub_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function saveSession(data) {
    localStorage.setItem("markethub_token", data.token);
    localStorage.setItem("markethub_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data);
    return data;
  }

  async function register(payload) {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveSession(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("markethub_token");
    localStorage.removeItem("markethub_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
