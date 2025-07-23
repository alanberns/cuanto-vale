export default function Footer() {
    return (
      <footer className="bg-gray-100 text-gray-600 text-sm mt-12 border-t border-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>
            Hecho por <strong>Alan Berns</strong> · {new Date().getFullYear()}
          </p>
          <a
            href="https://github.com/alanberns/precios-alimentos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            📂 Ver en GitHub
          </a>
        </div>
      </footer>
    );
  }
  