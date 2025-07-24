import { useEffect, useState } from "react";
import { formatearMes, esFechaValida, limitesFecha } from "../utils/fechas";
import Papa from "papaparse";

export default function CalculadorSueldoDolar() {
  const [dolarData, setDolarData] = useState([]);
  const [inflacionData, setInflacionData] = useState([]);
  const [fechaBase, setFechaBase] = useState("2020-01");
  const [sueldoActual, setSueldoActual] = useState(900000);
  const [resultado, setResultado] = useState(null);
  const [errorFecha, setErrorFecha] = useState("");

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
    const valorBase = dolarData.find((d) => d.mes === fechaBase)?.dolar_blue;
    const valorActual = dolarData[dolarData.length - 1]?.dolar_blue;

    if (!esFechaValida(fechaBase)) {
      setErrorFecha("La fecha seleccionada está fuera del rango disponible (2009 a junio 2025).");
      setResultado(null); 
      return;
    }
    setErrorFecha("");

    const desdeIndex = inflacionData.findIndex((i) => i.mes === fechaBase);
    const hastaIndex = inflacionData.length - 1;

    if (!valorBase || !valorActual || desdeIndex === -1 || hastaIndex <= desdeIndex) return;

    const inflacionAcumulada =
      inflacionData
        .slice(desdeIndex, hastaIndex + 1)
        .reduce((acc, val) => acc + val.inflacion, 0) / 100;

    const sueldoReducido = sueldoActual / (1 + inflacionAcumulada);
    const sueldoDolarHistorico = sueldoReducido / valorBase;
    const sueldoDolarActual = sueldoActual / valorActual;

    const diferencia = sueldoDolarActual - sueldoDolarHistorico;
    const diferenciaPorcentaje = ((sueldoDolarActual / sueldoDolarHistorico - 1) * 100).toFixed(2);

    setResultado({
      valorBase,
      valorActual,
      inflacion: (inflacionAcumulada * 100).toFixed(2),
      sueldoReducido: sueldoReducido.toFixed(2),
      sueldoDolarHistorico: sueldoDolarHistorico.toFixed(2),
      sueldoDolarActual: sueldoDolarActual.toFixed(2),
      diferencia: diferencia.toFixed(2),
      diferenciaPorcentaje,
    });
  };
  return (
    <div className="bg-green-50 rounded-xl shadow max-w-3xl mx-auto my-8 p-6 sm:p-8">
      <h2 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Calculador de sueldo en dólares (ajustado por inflación)
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4 max-w-xl mx-auto">
        Convertí tu sueldo en pesos a dólares y comparalo con su valor en otro momento. Descubrí si hoy ganás más o menos en dólares que antes, y cómo impactó la evolución del tipo de cambio en tu ingreso con respecto a la inflación.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Mes base</label>
          <input
            type="month"
            min={limitesFecha.min}
            max={limitesFecha.max}
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errorFecha && (
            <p className="text-red-600 text-sm mt-2 text-center sm:text-left">{errorFecha}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sueldo actual en pesos ($)</label>
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
          Calcular comparación
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💵 Dólar blue en ese mes</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.valorBase}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💵 Dólar blue actual</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.valorActual}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>📈 Inflación acumulada desde {formatearMes(fechaBase)}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.inflacion}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💸 Sueldo ajustado por inflación</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.sueldoReducido}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💰 Sueldo en dólares en {formatearMes(fechaBase)}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg whitespace-nowrap">USD {resultado.sueldoDolarHistorico}</div>
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
                ? `Tu sueldo actual equivale a USD ${resultado.sueldoDolarActual}, pero ajustado por inflación, en ${formatearMes(fechaBase)} habría sido USD ${resultado.sueldoDolarHistorico}. Perdiste ${Math.abs(resultado.diferenciaPorcentaje)}% de poder adquisitivo en dólares.`
                : `Tu sueldo actual equivale a USD ${resultado.sueldoDolarActual}, superando el valor ajustado por inflación de USD ${resultado.sueldoDolarHistorico}. Ganaste ${resultado.diferenciaPorcentaje}% de poder adquisitivo en dólares.`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
