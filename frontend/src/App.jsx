import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Login/Register.jsx";
import Welcome from "./pages/Welcome.jsx";
import Home from "./pages/Home.jsx"
import AdminPanel from "./pages/AdminPanel.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ServiciosConfig from "./pages/ModulosEdición/Home/ServiciosConfig.jsx"
import Bloque1Config from "./pages/ModulosEdición/Home/Bloque1Config.jsx"
import Carrusel from "./pages/ModulosEdición/Home/Carrusel.jsx"
import MapaConfig from "./pages/ModulosEdición/Home/MapaConfig.jsx"
import ValoresConfig from "./pages/ModulosEdición/Home/ValoresConfig.jsx"
import GaleriaHogarConfig from "./pages/ModulosEdición/Home/GaleriaHogarConfig.jsx"
import DisenoConfig from "./pages/ModulosEdición/Home/DisenoConfig.jsx"
import SobreNosotrosConfig from "./pages/ModulosEdición/Home/SobreNosotrosConfig.jsx"
import EquipoConfig from "./pages/ModulosEdición/Home/EquipoConfig.jsx"
import VideoConfig from "./pages/ModulosEdición/Home/VideoConfig.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/Bloque1Config" element={<ProtectedRoute><Bloque1Config /></ProtectedRoute>} />
      <Route path="/ServiciosConfig" element={<ProtectedRoute><ServiciosConfig /></ProtectedRoute>} />
      <Route path="/Carrusel" element={<ProtectedRoute><Carrusel /></ProtectedRoute>} />
      <Route path="/MapaConfig" element={<ProtectedRoute><MapaConfig /></ProtectedRoute>} />
      <Route path="/ValoresConfig" element={<ProtectedRoute><ValoresConfig /></ProtectedRoute>} />
      <Route path="/GaleriaHogarConfig" element={<ProtectedRoute><GaleriaHogarConfig /></ProtectedRoute>} />
      <Route path="/DisenoConfig" element={<ProtectedRoute><DisenoConfig /></ProtectedRoute>} />
      <Route path="/SobreNosotrosConfig" element={<ProtectedRoute><SobreNosotrosConfig /></ProtectedRoute>} />
      <Route path="/EquipoConfig" element={<ProtectedRoute><EquipoConfig /></ProtectedRoute>} />
      <Route path="/VideoConfig" element={<ProtectedRoute><VideoConfig /></ProtectedRoute>} />
    </Routes>
  );
}
