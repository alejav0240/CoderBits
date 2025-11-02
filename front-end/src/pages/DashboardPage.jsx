import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Activity,
  AlertTriangle,
  Lock,
  Users,
  Network,
  TrendingUp,
  CheckCircle,
  Bell,
} from "lucide-react";
import { useDashboardStats } from "../services/query/useDashboard";

const IDSDashboard = () => {
  const [user] = useState({ email: "admin@securewatch.com", name: "Admin" });
  const { data, isLoading } = useDashboardStats();
  const [summary, setSummary] = useState({
    ataques_activos: 0,
    ataques_hoy: 0,
    conexiones_hoy: 0,
    mitigaciones_exitosas: 0,
    ataques_ultimos_30_dias: 0,
  });

  // Simulación de carga animada
  useEffect(() => {
    if (data) {
      const duration = 1000;
      const steps = 60;
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setSummary({
          ataques_activos: Math.floor(data.ataques_activos * progress),
          ataques_hoy: Math.floor(data.ataques_hoy * progress),
          conexiones_hoy: Math.floor(data.conexiones_hoy * progress),
          mitigaciones_exitosas: Math.floor(data.mitigaciones_exitosas * progress),
          ataques_ultimos_30_dias: Math.floor(data.ataques_ultimos_30_dias * progress),
        });

        if (currentStep >= steps) clearInterval(interval);
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Sistema IDS</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">{user.email}</span>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido de vuelta, {user.name}! 👋
              </h1>
              <p className="text-cyan-100">
                Monitoreando red y analizando amenazas en tiempo real.
              </p>
            </div>
            <Shield className="w-20 h-20 text-white/20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ataques Activos */}
          <StatCard
            title="Ataques Activos"
            value={summary.ataques_activos}
            color="red"
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            note="+5% vs. ayer"
          />

          {/* Ataques Hoy */}
          <StatCard
            title="Ataques Hoy"
            value={summary.ataques_hoy}
            color="yellow"
            icon={<Activity className="w-6 h-6 text-yellow-400" />}
            note="Actividad diaria"
          />

          {/* Conexiones Hoy */}
          <StatCard
            title="Conexiones Hoy"
            value={summary.conexiones_hoy}
            color="cyan"
            icon={<Network className="w-6 h-6 text-cyan-400" />}
            note="Sesiones detectadas"
          />

          {/* Mitigaciones Exitosas */}
          <StatCard
            title="Mitigaciones Exitosas"
            value={summary.mitigaciones_exitosas}
            color="green"
            icon={<Lock className="w-6 h-6 text-green-400" />}
            note="Sin incidencias"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction
                to="/dashboard/users"
                colorFrom="cyan-500"
                colorTo="blue-500"
                icon={<Users className="w-7 h-7 text-white" />}
                title="Gestión de Usuarios"
                description="Administra usuarios del sistema"
              />
              <QuickAction
                to="/dashboard/mitigation"
                colorFrom="yellow-500"
                colorTo="orange-500"
                icon={<Shield className="w-7 h-7 text-white" />}
                title="Mitigación"
                description="Gestiona reglas de seguridad"
              />
              <QuickAction
                to="/dashboard/attacks"
                colorFrom="red-500"
                colorTo="pink-500"
                icon={<AlertTriangle className="w-7 h-7 text-white" />}
                title="Monitor de Ataques"
                description="Visualiza ataques en tiempo real"
              />
              <QuickAction
                to="/dashboard/traffic"
                colorFrom="purple-500"
                colorTo="indigo-500"
                icon={<Network className="w-7 h-7 text-white" />}
                title="Tráfico en Vivo"
                description="Monitoreo de red en vivo"
              />
            </div>
          </div>

          {/* Actividad reciente (placeholder) */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-slate-400">
              <p>No hay registros recientes por el momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === COMPONENTES REUTILIZABLES ===

const StatCard = ({ title, value, color, icon, note }) => (
  <div
    className={`bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-${color}-500/50 transition-all group`}
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <TrendingUp className={`w-5 h-5 text-${color}-400`} />
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-slate-400 text-sm">{title}</p>
    <div className={`mt-3 text-xs text-${color}-400`}>{note}</div>
  </div>
);

const QuickAction = ({ to, colorFrom, colorTo, icon, title, description }) => (
  <Link
    to={to}
    className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:scale-[1.02] hover:border-cyan-500/50 transition-all group cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`w-14 h-14 bg-gradient-to-br from-${colorFrom} to-${colorTo} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  </Link>
);

export default IDSDashboard;
