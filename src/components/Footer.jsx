export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-12 border-t border-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <div>
          <p>
            Hecho por <strong>Alan Berns</strong> · {new Date().getFullYear()} 🛠️
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Datos de <a href="https://datos.gob.ar" className="underline">datos.gob.ar</a>, <a href="https://www.investing.com" className="underline">investing.com</a> e <a href="https://indec.gob.ar" className="underline">INDEC</a>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <a
            href="https://github.com/alanberns/cuanto-vale"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            📂 Ver en GitHub
          </a>
          <a
            href="https://alanberns.com/enlaces"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            🌐 Página de enlaces
          </a>
        </div>
      </div>
    </footer>
  );
}
