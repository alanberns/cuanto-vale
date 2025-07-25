import { useEffect } from "react";

export default function MenuPrincipal({ onSelect }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const secciones = [
    {
      id: "boletos",
      titulo: "Boletos",
      descripcion: "Calculá cuántos boletos podés pagar según tu sueldo e inflación.",
      icono: "🚌",
    },
    {
      id: "sueldoDolares",
      titulo: "Mi sueldo en dólares",
      descripcion: "Convertí tu sueldo a dólares y compará con el pasado.",
      icono: "💵",
    },
    {
      id: "poder",
      titulo: "Poder adquisitivo",
      descripcion: "Medí si tu sueldo creció más o menos que la inflación.",
      icono: "📊",
    },
    {
      id: "dolares",
      titulo: "Inversión en dólares",
      descripcion: "Simulá si comprar dólares fue mejor que quedarse en pesos.",
      icono: "💱",
    },
    {
      id: "sueldoDolaresSimple",
      titulo: "Comparar sueldos en dólares",
      descripcion: "Medí si tu sueldo creció más o menos en dólares.",
      icono: "💸",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">📈 Explorá tu economía personal</h2>
        <p className="text-gray-600 mt-2 text-sm max-w-md mx-auto">
          Usá estas herramientas para entender cómo evolucionó tu poder adquisitivo, el transporte, el dólar y los precios en Argentina.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {secciones.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="rounded-xl bg-teal-100 shadow hover:shadow-md p-6 text-center flex flex-col items-center gap-3 transition "
          >
            <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow">
              {s.icono}
            </div>
            <h3 className="text-lg font-semibold text-teal-700">{s.titulo}</h3>
            <p className="text-sm text-gray-600">{s.descripcion}</p>
          </button>
        ))}
        <button disabled
          className="rounded-xl bg-teal-100 shadow hover:shadow-md p-6 text-center flex flex-col items-center gap-3 transition"
        >
          <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow">
            ❓
          </div>
          <h3 className="text-lg font-semibold text-teal-700">Próximamente</h3>
          <p className="text-sm text-gray-600">Vamos a añadir una nueva comparación.</p>
        </button>
      </div>

      <div className="mt-12 text-xs text-gray-500 text-center max-w-2xl mx-auto leading-relaxed">
        <p>
          Los valores de dólar utilizados corresponden al <strong>promedio mensual del dólar</strong>.
        </p>
        <p>
          Los datos de inflación provienen del <strong>INDEC</strong>
        </p>
        <p>
          Datos disponibles desde Enero 2009.
        </p>
        <p>
          Los cálculos no constituyen asesoramiento financiero. Son estimaciones basadas en datos públicos y pueden variar según la fuente o el método de cálculo.
        </p>
        <p>
          Fuentes: <a href="https://www.investing.com" target="_blank" rel="noopener noreferrer" className="underline">investing.com</a> - <a href="https://datos.gob.ar" target="_blank" rel="noopener noreferrer" className="underline">datos.gob.ar</a> - <a href="https://indec.gob.ar" target="_blank" rel="noopener noreferrer" className="underline">indec.gob.ar</a>.
        </p>
      </div>

    </div>
  );
}
