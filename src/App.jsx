import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CalculadorBoletos from "./pages/CalculadorBoletos";
import CalculadorPoderAdquisitivo from "./pages/CalculadorPoderAdquisitivo";
import ComparadorDolares from "./pages/ComparadorDolares";
import GraficoBoleto from "./pages/GraficoBoleto";
import MenuPrincipal from "./pages/MenuPrincipal";
import GraficoDolar from "./pages/GraficoDolar";
import CalculadorSueldoDolar from "./pages/CalculadorSueldoDolar";
import ComparadorSueldoDolarSimple from "./pages/ComparadorSueldoDolarSimple";

export default function App() {
  const [seccion, setSeccion] = useState("menu");

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={setSeccion} />
      <main className="flex-grow">
        {seccion === "menu" && <MenuPrincipal onSelect={setSeccion} />}
        {seccion === "boletos" && <CalculadorBoletos />}
        {seccion === "boletosGrafico" && <GraficoBoleto />}
        {seccion === "dolares" && <ComparadorDolares />}
        {seccion === "poder" && <CalculadorPoderAdquisitivo />}
        {seccion === "sueldoDolares" && <CalculadorSueldoDolar />}
        {seccion === "sueldoDolaresSimple" && <ComparadorSueldoDolarSimple />}
      </main>
      <Footer />
    </div>
  );
}
