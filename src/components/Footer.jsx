export default function Footer() {
  return (
    <footer className="bg-teal-800 text-gray-100 text-sm mt-12 border-t border-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">

        {/* Columna 1 */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-base font-semibold">La app</h2>
          <a
            href="https://github.com/alanberns/cuanto-vale"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Repositorio en GitHub
          </a>
          <p className="text-xs mt-1">
            Datos de <a href="https://datos.gob.ar" className="underline">datos.gob.ar</a>, <a href="https://www.investing.com" className="underline">investing.com</a> e <a href="https://indec.gob.ar" className="underline">INDEC</a>.
          </p>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-base font-semibold">Sobre mí</h2>
          <a
            href="https://alanberns.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Mi página de enlaces
          </a>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-center items-center gap-2 text-center">
        <br className="bg-white" />
        <p>
          Hecho por <strong>Alan Berns</strong> - {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
