import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function GraficoBoleto() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    Papa.parse(import.meta.env.BASE_URL + "datasets/precio_boleto.csv", {
      download: true,
      header: true,
      complete: (resultado) => {
        const limpio = resultado.data
          .filter((fila) => fila.mes && fila.boleto)
          .map((fila) => ({
            mes: fila.mes,
            boleto: parseFloat(fila.boleto),
          }));
        setDatos(limpio);
      },
    });
  }, []);

  if (datos.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Cargando boleto AMBA...</p>;
  }

  const labels = datos.map((d) => d.mes);
  const valores = datos.map((d) => d.boleto);

  const data = {
    labels,
    datasets: [
      {
        label: "Boleto mínimo AMBA ($)",
        data: valores,
        borderColor: "#0ea5e9",
        backgroundColor: "#0ea5e980",
        pointRadius: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 20 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Tarifa en pesos" },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">📈 Evolución del boleto AMBA</h2>
      <Line data={data} options={options} />
    </div>
  );
}
