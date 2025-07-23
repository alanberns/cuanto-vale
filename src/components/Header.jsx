import { useState } from "react";

export default function Header({ onNavigate }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navegar = (seccion) => {
    onNavigate(seccion);
    setMenuAbierto(false);
  };

  return (
    <header className="bg-teal-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-wide"><button
            onClick={() => navegar("menu")}
            className="block w-full text-left font-medium"
          >
            Cuánto vale mi sueldo
          </button></h1>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="text-2xl focus:outline-none"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {menuAbierto && (
        <nav className="bg-teal-600 text-white px-4 py-2 space-y-2">
          <button
            onClick={() => navegar("menu")}
            className="block w-full text-left font-medium hover:underline"
          >
            🏠 Inicio
          </button>
          <button
            onClick={() => navegar("boletos")}
            className="block w-full text-left font-medium hover:underline"
          >
            🚌 Boletos
          </button>
          <button
            onClick={() => navegar("dolares")}
            className="block w-full text-left font-medium hover:underline"
          >
            💵 Inversión en dólares
          </button>
          <button
            onClick={() => navegar("poder")}
            className="block w-full text-left font-medium hover:underline"
          >
            📊 Poder adquisitivo
          </button>
          <button
            onClick={() => navegar("sueldoDolares")}
            className="block w-full text-left font-medium hover:underline"
          >
            💵 Sueldo en dólares - con inflación
          </button>
          <button
            onClick={() => navegar("sueldoDolaresSimple")}
            className="block w-full text-left font-medium hover:underline"
          >
            💵 Sueldo en dólares - sin inflación
          </button>
        </nav>
      )}
    </header>
  );
}
