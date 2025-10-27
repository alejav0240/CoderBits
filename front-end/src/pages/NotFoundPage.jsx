import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react'; // ícono elegante

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-blue-100">
      {/* Icono central */}
      <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
        <ShieldAlert className="w-24 h-24 text-blue-400 drop-shadow-lg animate-pulse" />
        <h1 className="text-8xl font-extrabold text-blue-400 tracking-widest">404</h1>
        <h2 className="text-2xl font-semibold text-blue-200">
          Página no encontrada
        </h2>
        <p className="text-blue-300 max-w-md text-lg">
          Parece que has intentado acceder a un área restringida o inexistente del sistema IDS.
        </p>

        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl shadow-lg text-white font-semibold text-lg"
        >
          ← Volver al inicio
        </Link>
      </div>

      {/* Pie de página */}
      <footer className="absolute bottom-6 text-blue-400 text-sm opacity-70">
        IDS Monitoring System © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default NotFoundPage;
