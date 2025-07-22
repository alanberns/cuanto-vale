import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function CalculadorSueldoDolar() {
  const [dolarData, setDolarData] = useState([]);
  const [fechaBase, setFechaBase] = useState("2023-01");
  const [sueldoPesos, setSueldoPesos] = useState(100000);
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

    const sueldoDolarBase = (sueldoPesos / valorBase).toFixed(2);
    const sueldoDolarActual = (sueldoPesos / valorActual).toFixed(2);
    const variacion = ((valorActual - valorBase) / valorBase * 100).toFixed(2);

    setResultado({
      valorBase,
      valorActual,
      sueldoDolarBase,
      sueldoDolarActual,
      variacion,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">💸 Calculador de sueldo en dólares</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Mes base</label>
          <input
            type="month"
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Sueldo en pesos ($)</label>
          <input
            type="number"
            value={sueldoPesos}
            onChange={(e) => setSueldoPesos(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={calcular}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
      >
        Calcular en dólares
      </button>

      {resultado && (
        <div className="mt-6 text-gray-700 text-sm space-y-2">
          <p>📅 Mes seleccionado: <strong>{fechaBase}</strong></p>
          <p>💵 Dólar blue en ese mes: <strong>${resultado.valorBase}</strong></p>
          <p>💵 Dólar blue actual: <strong>${resultado.valorActual}</strong> ({resultado.variacion}% de variación)</p>
          <p>🧮 Sueldo en dólares en {fechaBase}: <strong>USD {resultado.sueldoDolarBase}</strong></p>
          <p>💰 Sueldo en dólares hoy: <strong>USD {resultado.sueldoDolarActual}</strong></p>
        </div>
      )}
    </div>
  );
}
