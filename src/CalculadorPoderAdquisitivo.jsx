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
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">💰 Calculador de poder adquisitivo</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mes base</label>
          <input
            type="month"
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo inicial ($)</label>
          <input
            type="number"
            value={sueldoBase}
            onChange={(e) => setSueldoBase(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo actual ($)</label>
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
        Calcular
      </button>

      {resultado && (
        <div className="mt-6 text-gray-700 text-sm space-y-2">
          <p>📈 Inflación acumulada: <strong>{resultado.inflacionAcumulada}%</strong></p>
          <p>💵 Tu sueldo creció: <strong>{resultado.crecimientoSueldo}%</strong></p>
          <p>🎯 Sueldo ajustado por inflación: <strong>${resultado.sueldoAjustado}</strong></p>
          <p>
            ⚖️ Variación real:{" "}
            <strong
              className={
                resultado.diferencia < 0 ? "text-red-600" : "text-green-600"
              }
            >
              {resultado.diferencia}%
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
