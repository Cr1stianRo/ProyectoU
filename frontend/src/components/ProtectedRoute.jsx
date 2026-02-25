// Componente wrapper que protege rutas privadas.
// Redirige a /login si no hay sesión activa y guarda la última ruta visitada.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Guarda la última ruta visitada en el backend para restaurarla al hacer login
  useEffect(() => {
    if (isAuthenticated) {
      api.put("/user/preferences", { lastVisitedRoute: location.pathname }).catch(() => {});
    }
  }, [location.pathname, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
