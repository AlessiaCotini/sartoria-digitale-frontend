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
import SoloCliente from "./components/SoloCliente";
import { Navigate } from "react-router-dom";
import GestionaleLayout from "./pages/gestionale/GestionaleLayout";
import Calendario from "./pages/gestionale/Calendario";
import Ordini from "./pages/gestionale/Ordini";
import NuovoOrdine from "./pages/gestionale/NuovoOrdine";
import Preventivi from "./pages/gestionale/Preventivi";
import Pagamenti from "./pages/gestionale/Pagamenti";
import GestioneCatalogo from "./pages/gestionale/GestioneCatalogo";
import Team from "./pages/gestionale/Team";
import Magazzino from "./pages/gestionale/Magazzino";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import TerminiCondizioni from "./pages/TerminiCondizioni";

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
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termini" element={<TerminiCondizioni />} />
        <Route path="/gestionale" element={<GestionaleLayout />}>
          <Route index element={<Navigate to="calendario" replace />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="ordini" element={<Ordini />} />
          <Route path="nuovo-ordine" element={<NuovoOrdine />} />
          <Route path="preventivi" element={<Preventivi />} />
          <Route path="pagamenti" element={<Pagamenti />} />
          <Route path="catalogo" element={<GestioneCatalogo />} />
          <Route path="magazzino" element={<Magazzino />} />
          <Route path="team" element={<Team />} />
        </Route>
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
