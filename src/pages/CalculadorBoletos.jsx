import { useEffect, useState } from "react";
import Papa from "papaparse";
import { formatearMes, esFechaValida, limitesFecha } from "../utils/fechas";

export default function CalculadorBoletos() {
  const [inflacionData, setInflacionData] = useState([]);
  const [boletoData, setBoletoData] = useState([]);
  const [fechaBase, setFechaBase] = useState("2023-01");
  const [sueldoBase, setSueldoBase] = useState(100000);
  const [sueldoActual, setSueldoActual] = useState(180000);
  const [resultado, setResultado] = useState(null);
  const [errorFecha, setErrorFecha] = useState("");


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  

  useEffect(() => {
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

    Papa.parse(import.meta.env.BASE_URL + "datasets/precio_boleto.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const limpio = res.data
          .filter((r) => r.mes && !isNaN(parseFloat(r.boleto)))
          .map((r) => ({
            mes: r.mes,
            boleto: parseFloat(r.boleto),
          }));
        setBoletoData(limpio);
      },
    });
  }, []);



  const calcular = () => {
    const desdeIndex = inflacionData.findIndex((d) => d.mes === fechaBase);
    const hastaIndex = inflacionData.length - 1;

    if (!esFechaValida(fechaBase)) {
      setErrorFecha("La fecha seleccionada está fuera del rango disponible (2009 a junio 2025).");
      setResultado(null);
      return;
    }
    setErrorFecha("");

    const inflacionAcumulada =
      inflacionData
        .slice(desdeIndex, hastaIndex + 1)
        .reduce((acc, val) => acc + val.inflacion, 0) / 100;

    const boletoBase = boletoData.find((b) => b.mes === fechaBase)?.boleto;
    const boletoActual = boletoData[boletoData.length - 1]?.boleto;

    if (!boletoBase || !boletoActual) return;

    const sueldoAjustado = sueldoBase * (1 + inflacionAcumulada);

    const boletosAntes = sueldoBase / boletoBase;
    const boletosEsperables = sueldoAjustado / boletoActual;
    const boletosReales = sueldoActual / boletoActual;

    // Porcentaje de pérdida vs esperable
    const perdidaPorcentaje = ((boletosReales / boletosEsperables - 1) * 100).toFixed(1);

    // Porcentaje de deterioro vs pasado
    const deterioroPorcentaje = ((boletosReales / boletosAntes - 1) * 100).toFixed(1);

    setResultado({
      inflacion: (inflacionAcumulada * 100).toFixed(2),
      sueldoAjustado: sueldoAjustado.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      boletoBase: boletoBase.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      boletoActual : boletoActual.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      boletosAntes: boletosAntes.toFixed(0),
      boletosEsperables: boletosEsperables.toFixed(0),
      boletosReales: boletosReales.toFixed(0),
      perdidaVsEsperables: (boletosReales - boletosEsperables).toFixed(0),
      deterioroVsAntes: (boletosReales - boletosAntes).toFixed(0),
      perdidaPorcentaje: perdidaPorcentaje,
      deterioroPorcentaje: deterioroPorcentaje,
    });
  };

  return (
    <div className="bg-teal-50 rounded-xl shadow max-w-3xl mx-auto my-8 p-6 sm:p-8">
      <h2 className="text-4xl font-bold text-teal-700 mb-6 text-center">
        Calculador de boletos por poder adquisitivo
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4 pb-2 max-w-xl mx-auto">
        Esta herramienta te permite comparar cuántos boletos de transporte podías pagar en el pasado con tu sueldo, y cuántos deberías poder pagar hoy según la inflación. Descubrí si tu poder adquisitivo mejoró o se deterioró.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Mes-año a comparar</label>
          <input
            type="month"
            min={limitesFecha.min}
            max={limitesFecha.max}
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errorFecha && (
            <p className="text-red-600 text-sm mt-2 text-center sm:text-left">{errorFecha}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sueldo en esa fecha ($)</label>
          <input
            type="number"
            value={sueldoBase}
            onChange={(e) => setSueldoBase(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sueldo actual ($)</label>
          <input
            type="number"
            value={sueldoActual}
            onChange={(e) => setSueldoActual(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={calcular}
          className="bg-teal-600 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-700 transition"
        >
          Calcular boletos
        </button>
      </div>

      {resultado && (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {/* Inflación */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>📈 Inflación acumulada desde {formatearMes(fechaBase)}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.inflacion}%</div>
            </div>

            {/* Boleto base */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>🎟️ Valor del boleto en {formatearMes(fechaBase)}</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.boletoBase}</div>
            </div>

            {/* Boleto actual */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>🎟️ Valor del boleto hoy</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.boletoActual}</div>
            </div>

            {/* Sueldo ajustado */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💼 Sueldo ajustado por inflación</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.sueldoAjustado}</div>
            </div>

            {/* Boletos antes */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>🚌 Boletos que pagabas antes</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.boletosAntes}</div>
            </div>

            {/* Boletos esperables */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p className="text-sm text-gray-600">🚌 Boletos que deberías pagar hoy</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">
                {resultado.boletosEsperables}
              </div>
            </div>

            {/* Boletos reales */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💰 Boletos reales que podés pagar hoy</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.boletosReales}</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div
              className={`rounded-xl px-6 py-4 text-white text-center font-semibold text-lg shadow-md ${resultado.perdidaVsEsperables < 0 ? "bg-red-600" : "bg-green-700"
                }`}
            >
              Ahora podés pagar {Math.abs(resultado.perdidaVsEsperables)} boleto(s) {resultado.perdidaVsEsperables < 0 ? "menos" : "más"} ({resultado.perdidaPorcentaje}%) que lo esperado según inflación.
            </div>

            <div
              className={`rounded-xl px-6 py-4 text-white text-center font-semibold text-lg shadow-md ${resultado.deterioroVsAntes < 0 ? "bg-red-600" : "bg-green-700"
                }`}
            >
              En comparación con el pasado, tu capacidad de compra cambió en {Math.abs(resultado.deterioroVsAntes)} boleto(s) {resultado.deterioroVsAntes < 0 ? "menos" : "más"} ({resultado.deterioroPorcentaje}%).
            </div>

          </div>
        </>
      )}
    </div>
  );
};  