import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function ComparadorSueldoDolarSimple() {
  const [dolarData, setDolarData] = useState([]);
  const [fechaBase, setFechaBase] = useState("2020-01");
  const [sueldoBase, setSueldoBase] = useState(50000);
  const [sueldoActual, setSueldoActual] = useState(900000);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    Papa.parse(import.meta.env.BASE_URL + "datasets/dolar_blue/dolar_blue_avg_mensual.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const limpio = res.data
          .filter((r) => r.mes && !isNaN(parseFloat(r.dolar_blue)))
          .map((r) => ({
            mes: r.mes,
            dolar_blue: parseFloat(r.dolar_blue),
          }));
        setDolarData(limpio);
      },
    });
  }, []);
  const calcular = () => {
    const valorBase = dolarData.find((d) => d.mes === fechaBase)?.dolar_blue;
    const valorActual = dolarData[dolarData.length - 1]?.dolar_blue;

    if (!valorBase || !valorActual) return;

    const sueldoDolarBase = sueldoBase / valorBase;
    const sueldoDolarActual = sueldoActual / valorActual;
    const diferencia = sueldoDolarActual - sueldoDolarBase;
    const diferenciaPorcentaje = ((sueldoDolarActual / sueldoDolarBase - 1) * 100).toFixed(2);

    setResultado({
      valorBase,
      valorActual,
      sueldoDolarBase: sueldoDolarBase.toFixed(2),
      sueldoDolarActual: sueldoDolarActual.toFixed(2),
      diferencia: diferencia.toFixed(2),
      diferenciaPorcentaje,
    });
  };
  return (
    <div className="bg-green-50 rounded-xl shadow max-w-3xl mx-auto my-8 p-6 sm:p-8">
      <h2 className="text-4xl font-bold text-green-700 mb-2 text-center">
        Comparador de sueldo en dólares (sin inflación)
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4 pb-2 max-w-xl mx-auto">
        Ingresá tu sueldo actual y el sueldo que tenías en otra fecha. Esta herramienta convierte ambos a dólares según el tipo de cambio y te muestra si ganás más o menos en moneda dura.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Mes-año a comparar</label>
          <input
            type="month"
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sueldo en ese mes ($)</label>
          <input
            type="number"
            value={sueldoBase}
            onChange={(e) => setSueldoBase(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sueldo actual ($)</label>
          <input
            type="number"
            value={sueldoActual}
            onChange={(e) => setSueldoActual(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          onClick={calcular}
          className="bg-teal-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition"
        >
          Comparar sueldos
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>📅 Dólar en {fechaBase}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.valorBase}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💵 Dólar actual</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.valorActual}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>🧮 Sueldo en dólares en {fechaBase}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg whitespace-nowrap">USD {resultado.sueldoDolarBase}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💰 Sueldo en dólares hoy</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg whitespace-nowrap">USD {resultado.sueldoDolarActual}</div>
            </div>
          </div>

          {/* Frase narrativa final */}
          <div className="mt-8">
            <div
              className={`rounded-xl px-6 py-4 text-white text-center font-semibold text-lg shadow-md ${
                resultado.diferenciaPorcentaje < 0 ? "bg-red-600" : "bg-green-700"
              }`}
            >
              {resultado.diferenciaPorcentaje < 0
                ? `Tu sueldo en dólares cayó respecto a ${fechaBase}: ganás ${Math.abs(resultado.diferenciaPorcentaje)}% menos.`
                : `Tu sueldo en dólares mejoró respecto a ${fechaBase}: ganás ${resultado.diferenciaPorcentaje}% más.`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
