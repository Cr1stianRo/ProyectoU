// Componente wrapper que protege rutas privadas.
// Redirige a /login si no hay sesión activa y guarda la última ruta visitada.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loggingOut } = useAuth();
  const location = useLocation();

  // Guarda la última ruta visitada en el backend para restaurarla al hacer login
  useEffect(() => {
    if (isAuthenticated) {
      api.put("/user/preferences", { lastVisitedRoute: location.pathname }).catch(() => {});
    }
  }, [location.pathname, isAuthenticated]);

  // Si el usuario está cerrando sesión, no redirigir a /login (el logout ya navega a /)
  if (!isAuthenticated && !loggingOut) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated && loggingOut) {
    return <Navigate to="/" replace />;
  }

  return children;
}
