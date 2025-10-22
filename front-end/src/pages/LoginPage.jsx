import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginForm';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const LoginPage = () => {
  const { user } = useAuth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-2xl shadow-cyan-500/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema IDS</h1>
          <p className="text-slate-400">Sistema de Detección de Intrusos</p>
        </div>
        <LoginForm />
        {/* Footer Links */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-slate-400 text-sm">
            ¿No tienes una cuenta?{' '}
            <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Solicitar acceso
            </button>
          </p>
          <p className="text-slate-500 text-xs">
            © 2025 Sistema IDS. Sistema protegido con encriptación de extremo a extremo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;