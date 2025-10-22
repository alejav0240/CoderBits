import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../services/validations/authValidation";
import { useLogin } from "../../../services/query/useAuth";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import React, { useState } from "react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  // Definición de handleSubmit: Se crea la función que maneja el envío.
  const handleLogin = (data) => {
    mutate(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      // ✅ Campo 1: 'usuario'
      usuario: "",
      // ✅ Campo 2: 'contrasena' (Ajustado para coincidir con el uso en el input)
      contrasena: "",
    },
  });
  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);
  // Se extrae la lógica de mutación y estado de pendiente del hook
  const { mutate, isPending } = useLogin();

  // 💡 Corrección: La función que se pasa al form es handleSubmit, que envuelve a handleLogin
  const onSubmit = handleSubmit(handleLogin);

  return (
    <>
      {/* Login Card */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6 pb-6 border-b border-slate-700/50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Sistema en línea</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
        <p className="text-slate-400 mb-8">Accede al panel de control</p>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 text-sm font-medium">
                Error de autenticación
              </p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-300 text-sm font-medium">
                ¡Autenticación exitosa!
              </p>
              <p className="text-green-400 text-sm mt-1">
                Redirigiendo al dashboard...
              </p>
            </div>
          </div>
        )}
        {/* Login Form */}
        <div className="space-y-6">
          <form onSubmit={onSubmit}>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="admin"
                  {...register("usuario")}
                  disabled={isPending || success}
                />
              </div>
                              {/* Muestra errores del campo 'usuario' */}
                {errors.usuario && (
                    <div className="mt-2 p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      <span className="font-medium">{errors.usuario.message}</span>
                    </div>
                )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  {...register("contrasena")}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={isPending || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={isPending || success}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
                              {errors.contrasena && (
                    <div className="mt-2 p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      <span className="font-medium">{errors.contrasena.message}</span>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isPending || success}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mt-5 space-x-2 group"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>¡Acceso concedido!</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium mb-2">
              🔑 Credenciales de prueba:
            </p>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <p>
                Usuario: <span className="text-cyan-400">admin</span>
              </p>
              <p>
                Contraseña: <span className="text-cyan-400">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
