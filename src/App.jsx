import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogo from "./pages/Catalogo";
import Configuratore from "./pages/Configuratore";
import Profilo from "./pages/Profilo";
import Preventivo from "./pages/Preventivo";
import NavbarSartoria from "./components/Navbar";
import FooterSartoria from "./components/FooterSartoria";

function App() {
  return (
    <BrowserRouter>
      <NavbarSartoria />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/configuratore" element={<Configuratore />} />
        <Route path="/profilo" element={<Profilo />} />
        <Route path="/preventivo" element={<Preventivo />} />
      </Routes>
      <FooterSartoria />
    </BrowserRouter>
  );
}

export default App;
