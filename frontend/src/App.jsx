import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Login/Register.jsx";
import Home from "./pages/Home.jsx"
import AdminPanel from "./pages/AdminPanel.jsx"
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/Bloque1Config" element={<Bloque1Config />} />
      <Route path="/ServiciosConfig" element={<ServiciosConfig />} />
      <Route path="/Carrusel" element={<Carrusel />} />
      <Route path="/MapaConfig" element={<MapaConfig />} />
      <Route path="/ValoresConfig" element={<ValoresConfig />} />
      <Route path="/GaleriaHogarConfig" element={<GaleriaHogarConfig />} />
      <Route path="/DisenoConfig" element={<DisenoConfig />} />
      <Route path="/SobreNosotrosConfig" element={<SobreNosotrosConfig />} />
      <Route path="/EquipoConfig" element={<EquipoConfig />} />
      <Route path="/VideoConfig" element={<VideoConfig />} />
    </Routes>
  );
}
