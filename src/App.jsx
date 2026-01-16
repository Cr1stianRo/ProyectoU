import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import HomeSettings from "./pages/HomeSettings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Plantilla1 from "./pages/Plantilla1.jsx"

import Bloque1Config from "./pages//Bloque1Config.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home-settings" element={<HomeSettings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/p1" element={<Plantilla1 />} />
      <Route path="/Bloque1Config" element={<Bloque1Config />} />
    </Routes>
  );
}
