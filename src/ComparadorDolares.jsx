import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function ComparadorDolares() {
  const [dolarData, setDolarData] = useState([]);
  const [inflacionData, setInflacionData] = useState([]);
  const [fechaCompra, setFechaCompra] = useState("2022-06");
  const [cantidadDolares, setCantidadDolares] = useState(100);
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
            dolar: parseFloat(r.dolar_blue),
          }));
        setDolarData(limpio);
      },
    });

    Papa.parse(import.meta.env.BASE_URL + "datasets/inflacion_mensual.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const limpio = res.data
          .filter((r) => r.mes && !isNaN(parseFloat(r.inflacion)))
          .map((r) => ({
            mes: r.mes,
            inflacion: parseFloat(r.inflacion),
          }));
        setInflacionData(limpio);
      },
    });
  }, []);

  const calcular = () => {
    const valorPasado = dolarData.find((d) => d.mes === fechaCompra)?.dolar;
    const valorActual = dolarData[dolarData.length - 1]?.dolar;

    const desdeIndex = inflacionData.findIndex((i) => i.mes === fechaCompra);
    const hastaIndex = inflacionData.length - 1;

    if (!valorPasado || !valorActual || desdeIndex === -1 || hastaIndex <= desdeIndex) return;

    const inversionPasada = valorPasado * cantidadDolares;
    const valorHoy = valorActual * cantidadDolares;
    const gananciaPesos = valorHoy - inversionPasada;
    const gananciaPorcentaje = ((valorHoy / inversionPasada - 1) * 100).toFixed(2);

    const inflacionAcumulada =
      inflacionData
        .slice(desdeIndex, hastaIndex + 1)
        .reduce((acc, val) => acc + val.inflacion, 0) / 100;

    const inversionAjustada = inversionPasada * (1 + inflacionAcumulada);
    const diferencialVsInflacion = valorHoy - inversionAjustada;
    const diferencialPorcentaje = ((valorHoy / inversionAjustada - 1) * 100).toFixed(2);

    const variacion = ((valorActual - valorPasado) / valorPasado * 100).toFixed(2);

    setResultado({
      valorPasado,
      valorActual,
      inversionPasada: inversionPasada.toFixed(2),
      valorHoy: valorHoy.toFixed(2),
      gananciaPesos: gananciaPesos.toFixed(2),
      gananciaPorcentaje,
      inflacion: (inflacionAcumulada * 100).toFixed(2),
      inversionAjustada: inversionAjustada.toFixed(2),
      diferencialVsInflacion: diferencialVsInflacion.toFixed(2),
      diferencialPorcentaje,
      variacion,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">💱 Comparador de inversión en dólares vs inflación</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Mes de compra</label>
          <input
            type="month"
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Cantidad de dólares (USD)</label>
          <input
            type="number"
            value={cantidadDolares}
            onChange={(e) => setCantidadDolares(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={calcular}
        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
      >
        Calcular inversión
      </button>

      {resultado && (
        <div className="mt-6 text-gray-700 text-sm space-y-2">
          <p>📅 Dólar en {fechaCompra}: <strong>${resultado.valorPasado}</strong></p>
          <p>📅 Dólar actual: <strong>${resultado.valorActual} ({resultado.variacion}% de variación)</strong></p>
          <p>💸 Inversión inicial en pesos: <strong>${resultado.inversionPasada}</strong></p>
          <p>💰 Valor actual de esos dólares: <strong>${resultado.valorHoy}</strong></p>
          <p>
            📈 Ganancia directa:{" "}
            <strong className={resultado.gananciaPesos < 0 ? "text-red-600" : "text-green-600"}>
              ${resultado.gananciaPesos} ({resultado.gananciaPorcentaje}%)
            </strong>
          </p>
          <p>📈 Inflación acumulada desde {fechaCompra}: <strong>{resultado.inflacion}%</strong></p>
          <p>🎯 Valor ajustado por inflación: <strong>${resultado.inversionAjustada}</strong></p>
          <p>
            🧮 Diferencia respecto al ajuste:{" "}
            <strong className={resultado.diferencialVsInflacion < 0 ? "text-red-600" : "text-green-600"}>
              ${resultado.diferencialVsInflacion} ({resultado.diferencialPorcentaje}%)
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
