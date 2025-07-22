import Papa from "papaparse";
import { useState, useEffect } from "react";
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

function App() {
  const [economia, setEconomia] = useState([]);

  useEffect(() => {
    const cargarCSV = (ruta) =>
      new Promise((resolve) => {
        Papa.parse(ruta, {
          download: true,
          header: true,
          complete: (resultado) => resolve(resultado.data),
        });
      });

    Promise.all([
      cargarCSV(import.meta.env.BASE_URL + "datasets/inflacion_mensual.csv"),
      cargarCSV(import.meta.env.BASE_URL + "datasets/dolar_oficial/dolar_oficial_promedio_mensual.csv"),
      cargarCSV(import.meta.env.BASE_URL + "datasets/dolar_blue/dolar_blue_avg_mensual.csv"),
    ]).then(([inflacionData, oficialData, blueData]) => {
      const combinado = inflacionData.map((fila, i) => ({
        mes: fila.mes,
        inflacion: parseFloat(fila.inflacion),
        dolar: parseFloat(oficialData[i]?.dolar || 0),
        dolar_blue: parseFloat(blueData[i]?.dolar_blue || 0),
      }));
      setEconomia(combinado);
    });
  }, []);

  if (economia.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Cargando datos económicos...</p>;
  }

  // 📊 Preparar datos para el gráfico
  const labels = economia.map((item) => item.mes);
  const oficial = economia.map((item) => item.dolar);
  const blue = economia.map((item) => item.dolar_blue);
  const inflacion = economia.map((item, i) =>
    economia.slice(0, i + 1).reduce((acc, val) => acc + val.inflacion, 0).toFixed(2)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Dólar Oficial",
        data: oficial,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f680",
        tension: 0.3,
      },
      {
        label: "Dólar Blue",
        data: blue,
        borderColor: "#ef4444",
        backgroundColor: "#ef444480",
        tension: 0.3,
      },
      {
        label: "Inflación Acumulada",
        data: inflacion,
        borderColor: "#10b981",
        backgroundColor: "#10b98180",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-700">📊 Evolución económica</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default App;
