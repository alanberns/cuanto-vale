import { useEffect, useState } from "react";
import { formatearMes, esFechaValida, limitesFecha } from "../utils/fechas";
import Papa from "papaparse";

export default function ComparadorDolares() {
  const [dolarData, setDolarData] = useState([]);
  const [inflacionData, setInflacionData] = useState([]);
  const [fechaCompra, setFechaCompra] = useState("2022-06");
  const [cantidadDolares, setCantidadDolares] = useState(100);
  const [resultado, setResultado] = useState(null);
  const [errorFecha, setErrorFecha] = useState("");


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  
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

    if (!esFechaValida(fechaCompra)) {
      setErrorFecha("La fecha seleccionada está fuera del rango disponible (2009 a junio 2025).");
      setResultado(null); 
      return;
    }
    setErrorFecha("");

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
      valorPasado: valorPasado.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      valorActual: valorActual.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      inversionPasada: inversionPasada.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      valorHoy: valorHoy.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      gananciaPesos: gananciaPesos.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      gananciaPorcentaje,
      inflacion: (inflacionAcumulada * 100).toFixed(2),
      inversionAjustada: inversionAjustada.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      diferencialVsInflacion: diferencialVsInflacion.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      diferencialPorcentaje,
      variacion,
    });
  };

  return (
    <div className="bg-teal-50 rounded-xl shadow max-w-3xl mx-auto my-8 p-6 sm:p-8">
      <h2 className="text-4xl font-bold text-teal-700 mb-6 text-center">
        Comparador de inversión en dólares vs inflación
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4 pb-2 max-w-xl mx-auto">
        ¿Convino comprar dólares en el pasado? Esta herramienta compara el valor actual de esa inversión con lo que habrías tenido si tu dinero hubiera seguido el ritmo de la inflación. Descubrí si ganaste o perdiste poder adquisitivo.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Mes de compra</label>
          <input
            type="month"
            min={limitesFecha.min}
            max={limitesFecha.max}
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errorFecha && (
            <p className="text-red-600 text-sm mt-2 text-center sm:text-left">{errorFecha}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Cantidad de dólares (USD)</label>
          <input
            type="number"
            value={cantidadDolares}
            onChange={(e) => setCantidadDolares(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          onClick={calcular}
          className="bg-teal-600 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-700 transition"
        >
          Calcular inversión
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {[
              { label: `📅 Dólar en ${formatearMes(fechaCompra)}`, value: `$${resultado.valorPasado}` },
              { label: `💵 Dólar actual`, value: `$${resultado.valorActual} (${resultado.variacion}%)`, nowrap: true },
              { label: `💸 Inversión inicial en pesos`, value: `$${resultado.inversionPasada}` },
              { label: `💰 Valor actual de esos dólares`, value: `$${resultado.valorHoy}` },
              {
                label: `📈 Variación directa`,
                value: `$${resultado.gananciaPesos} (${resultado.gananciaPorcentaje}%)`,
                color: resultado.gananciaPesos < 0 ? "text-red-600" : "text-green-600",
                nowrap: true,
              },
              { label: `📈 Inflación acumulada desde ${formatearMes(fechaCompra)}`, value: `${resultado.inflacion}%` },
              { label: `🎯 Valor ajustado por inflación`, value: `$${resultado.inversionAjustada}` },
              {
                label: `💵 Diferencia respecto al ajuste`,
                value: `$${resultado.diferencialVsInflacion} (${resultado.diferencialPorcentaje}%)`,
                color: resultado.diferencialVsInflacion < 0 ? "text-red-600" : "text-green-600",
                nowrap: true,
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <p>{item.label}</p>
                <div
                  className={`font-bold text-xl px-4 py-2 rounded-lg ${item.color || ""} ${item.nowrap ? "whitespace-nowrap" : ""
                    }`}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Frase narrativa final */}
          <div className="mt-8">
            <div
              className={`rounded-xl px-6 py-4 text-white text-center font-semibold text-lg shadow-md ${resultado.diferencialVsInflacion < 0 ? "bg-red-600" : "bg-green-700"
                }`}
            >
              {resultado.diferencialVsInflacion < 0
                ? `Invertir en dólares fue peor que quedarse en pesos: perdiste ${Math.abs(
                  resultado.diferencialPorcentaje
                )}% frente a la inflación.`
                : `Invertir en dólares fue mejor que quedarse en pesos: ganaste ${resultado.diferencialPorcentaje}% sobre la inflación.`}
            </div>
          </div>
        </>
      )}
    </div>


  );
}
