// Contexto global de autenticación.
// Persiste usuario y token en localStorage para mantener la sesión entre recargas.
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializa el estado desde localStorage para persistir la sesión
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loggingOut, setLoggingOut] = useState(false);

  const isAuthenticated = !!token;

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenValue);
    setLoggingOut(false);
  };

  const logout = () => {
    setLoggingOut(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loggingOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder al contexto de autenticación desde cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}
