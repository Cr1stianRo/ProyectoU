import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Login/Register.jsx";
import Home from "./pages/Home.jsx"
import CuidadoBloque from "./pages/ModulosEdición/Home/CuidadoBloque.jsx"
import Bloque1Config from "./pages/ModulosEdición/Home/Bloque1Config.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Bloque1Config" element={<Bloque1Config />} />
      <Route path="/CuidadoBloque" element={<CuidadoBloque />} />
    </Routes>
  );
}
