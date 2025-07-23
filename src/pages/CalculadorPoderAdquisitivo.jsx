import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function CalculadorPoderAdquisitivo() {
  const [inflacionMensual, setInflacionMensual] = useState([]);
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
          .filter((r) => r.mes && r.inflacion)
          .map((r) => ({
            mes: r.mes,
            inflacion: parseFloat(r.inflacion),
          }));
        setInflacionMensual(limpio);
      },
    });
  }, []);

  const calcular = () => {
    const desdeIndex = inflacionMensual.findIndex((m) => m.mes === fechaBase);
    const hastaIndex = inflacionMensual.length - 1;

    if (desdeIndex === -1 || hastaIndex <= desdeIndex) return;

    const inflacionAcumulada =
      inflacionMensual
        .slice(desdeIndex, hastaIndex + 1)
        .reduce((acc, val) => acc + val.inflacion, 0) / 100;

    const sueldoAjustado = sueldoBase * (1 + inflacionAcumulada);
    const crecimientoSueldo = ((sueldoActual - sueldoBase) / sueldoBase) * 100;
    const diferencia = ((sueldoActual - sueldoAjustado) / sueldoAjustado) * 100;

    setResultado({
      inflacionAcumulada: (inflacionAcumulada * 100).toFixed(2),
      crecimientoSueldo: crecimientoSueldo.toFixed(2),
      sueldoAjustado: sueldoAjustado.toFixed(2),
      diferencia: diferencia.toFixed(2),
    });
  };

  return (
    <div className="bg-teal-50 rounded-xl shadow max-w-3xl mx-auto my-8 p-6 sm:p-8">
      <h2 className="text-4xl font-bold text-teal-700 mb-6 text-center">
        Calculador de poder adquisitivo
      </h2>
      <p className="text-sm text-gray-600 pb-2 text-center mb-4 max-w-xl mx-auto">
        Comprobá si tu sueldo actual mantiene el mismo poder de compra que antes. Esta herramienta ajusta tu salario por inflación y te muestra si estás ganando más, igual o menos en términos reales.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mes-año a comparar</label>
          <input
            type="month"
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sueldo inicial ($)</label>
          <input
            type="number"
            value={sueldoBase}
            onChange={(e) => setSueldoBase(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sueldo actual ($)</label>
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
          Calcular
        </button>
      </div>

      {resultado && (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>📈 Inflación acumulada</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.inflacionAcumulada}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>💵 Tu sueldo creció</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">{resultado.crecimientoSueldo}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>🎯 Sueldo ajustado por inflación</p>
              <div className="font-bold text-xl px-4 py-2 rounded-lg">${resultado.sueldoAjustado}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <p>⚖️ Variación real</p>
              <div
                className={`font-bold text-xl px-4 py-2 rounded-lg ${resultado.diferencia < 0 ? "text-red-600" : "text-green-600"
                  }`}
              >
                {resultado.diferencia}%
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div
              className={`rounded-xl px-6 py-4 text-white text-center font-semibold text-lg shadow-md ${resultado.diferencia < 0 ? "bg-red-600" : "bg-green-700"
                }`}
            >
              Tu poder adquisitivo {resultado.diferencia < 0 ? "cayó" : "mejoró"} un {Math.abs(resultado.diferencia)}% respecto al ajuste por inflación.
            </div>
          </div>
        </>
      )}
    </div>

  );
}
