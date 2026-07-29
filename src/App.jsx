import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Configuratore from "./pages/Configuratore";
import Profilo from "./pages/Profilo";
import Preventivo from "./pages/Preventivo";
import NavbarSartoria from "./components/NavbarSartoria";
import Footer from "./components/Footer";
import Catalogo from "./pages/Catalogo";
import Dettaglio from "./pages/Dettaglio";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { utenteAttuale } from "./api/auth";
import { misureMie } from "./api/misure";
import GestionaleSarta from "./pages/GestionaleSarta";
import SoloCliente from "./components/SoloCliente";

function App() {
  const dispatch = useDispatch();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let attivo = true;

    async function ripristinaSessione() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const utente = await utenteAttuale();
        const misure = utente.ruolo === "CLIENTE" ? await misureMie() : null;
        if (attivo) dispatch(login({ utente, misure }));
      } catch {
        localStorage.removeItem("token");
      }
    }

    ripristinaSessione().finally(() => {
      if (attivo) setPronto(true);
    });

    return () => {
      attivo = false;
    };
  }, [dispatch]);

  if (!pronto) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavbarSartoria />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gestionale" element={<GestionaleSarta />} />
        <Route
          path="/"
          element={
            <SoloCliente>
              <Home />
            </SoloCliente>
          }
        />
        <Route
          path="/catalogo"
          element={
            <SoloCliente>
              <Catalogo />
            </SoloCliente>
          }
        />
        <Route
          path="/catalogo/:id"
          element={
            <SoloCliente>
              <Dettaglio />
            </SoloCliente>
          }
        />
        <Route
          path="/configuratore"
          element={
            <SoloCliente>
              <Configuratore />
            </SoloCliente>
          }
        />
        <Route
          path="/profilo"
          element={
            <SoloCliente>
              <Profilo />
            </SoloCliente>
          }
        />
        <Route
          path="/preventivo"
          element={
            <SoloCliente>
              <Preventivo />
            </SoloCliente>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
