// Instancia de Axios preconfigurada para comunicarse con el backend.
// El interceptor inyecta el JWT en cada petición automáticamente.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Interceptor: adjunta el token de autenticación a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
