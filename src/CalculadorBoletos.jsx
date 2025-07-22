import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function CalculadorBoletos() {
  const [inflacionData, setInflacionData] = useState([]);
  const [boletoData, setBoletoData] = useState([]);
  const [fechaBase, setFechaBase] = useState("2023-01");
  const [sueldoBase, setSueldoBase] = useState(100000);
  const [sueldoActual, setSueldoActual] = useState(180000);
  const [resultado, setResultado] = useState(null);

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
    const deterioroPorcentaje = ((boletosEsperables / boletosAntes - 1) * 100).toFixed(1);

    setResultado({
      inflacion: (inflacionAcumulada * 100).toFixed(2),
      sueldoAjustado: sueldoAjustado.toFixed(2),
      boletoBase,
      boletoActual,
      boletosAntes: boletosAntes.toFixed(0),
      boletosEsperables: boletosEsperables.toFixed(0),
      boletosReales: boletosReales.toFixed(0),
      perdidaVsEsperables: (boletosReales - boletosEsperables).toFixed(0),
      deterioroVsAntes: (boletosEsperables - boletosAntes).toFixed(0),
      perdidaPorcentaje: perdidaPorcentaje,
      deterioroPorcentaje: deterioroPorcentaje,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">🚌 Calculador de boletos por poder adquisitivo</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
          <label className="text-sm font-medium text-gray-700 mb-1 block">Sueldo en esa fecha ($)</label>
          <input
            type="number"
            value={sueldoBase}
            onChange={(e) => setSueldoBase(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Sueldo actual ($)</label>
          <input
            type="number"
            value={sueldoActual}
            onChange={(e) => setSueldoActual(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={calcular}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        Calcular boletos
      </button>

      {resultado && (
        <div className="mt-6 text-gray-700 text-sm space-y-2">
          <p>📈 Inflación acumulada desde {fechaBase}: <strong>{resultado.inflacion}%</strong></p>
          <p>🎟️ Valor del boleto en {fechaBase}: <strong>${resultado.boletoBase}</strong></p>
          <p>🎟️ Valor del boleto hoy: <strong>${resultado.boletoActual}</strong></p>
          <p>💼 Sueldo ajustado por inflación: <strong>${resultado.sueldoAjustado}</strong></p>
          <p>🚌 Boletos que pagabas antes: <strong>{resultado.boletosAntes}</strong></p>
          <p>🧮 Boletos que deberías pagar hoy: <strong>{resultado.boletosEsperables}</strong></p>
          <p>💰 Boletos reales que podés pagar hoy: <strong>{resultado.boletosReales}</strong></p>
            <p>
                📉 Diferencia vs esperado:{" "}
                <strong className={resultado.perdidaVsEsperables < 0 ? "text-red-600" : "text-green-600"}>
                    {resultado.perdidaVsEsperables} boletos ({resultado.perdidaPorcentaje}%)
                </strong>
            </p>
            <p>
                🕳️ Deterioro vs pasado:{" "}
                <strong className={resultado.deterioroVsAntes < 0 ? "text-red-600" : "text-green-600"}>
                    {resultado.deterioroVsAntes} boletos ({resultado.deterioroPorcentaje}% del valor de antes)
                </strong>
            </p>
        </div>
      )}
    </div>
  );
}
