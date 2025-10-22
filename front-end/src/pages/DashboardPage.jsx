import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import dashboardService from "../services/dashboardService";
import { Shield, Activity, AlertTriangle, Lock, Users, Network, TrendingUp, Server, Eye, Bell, CheckCircle, XCircle } from 'lucide-react';


const IDSDashboard = () => {
  const [user] = useState({ email: 'admin@securewatch.com', name: 'Admin' });
  //const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Summary stats con animación de conteo
  const [summary, setSummary] = useState({
    totalAttacks: 0,
    activeThreats: 0,
    mitigationRules: 0,
    activeConnections: 0,
  });

  const finalStats = {
    totalAttacks: 1247,
    activeThreats: 3,
    mitigationRules: 89,
    activeConnections: 142,
  };

  // Actividad reciente
  const [recentActivity] = useState([
    { id: 1, type: 'threat', message: 'SQL Injection bloqueado desde 192.168.1.45', time: '2 min', severity: 'high' },
    { id: 2, type: 'success', message: 'Nueva regla de mitigación activada', time: '5 min', severity: 'low' },
    { id: 3, type: 'warning', message: 'Incremento de tráfico desde IP sospechosa', time: '12 min', severity: 'medium' },
    { id: 4, type: 'info', message: 'Actualización de firma de amenazas completada', time: '1 hora', severity: 'low' },
  ]);

  // Animación de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animación de conteo para las stats
  useEffect(() => {
    if (!loading) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setSummary({
          totalAttacks: Math.floor(finalStats.totalAttacks * progress),
          activeThreats: Math.floor(finalStats.activeThreats * progress),
          mitigationRules: Math.floor(finalStats.mitigationRules * progress),
          activeConnections: Math.floor(finalStats.activeConnections * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setSummary(finalStats);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <Bell className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Activity className="w-5 h-5 text-blue-400" />;
      default: return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
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
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido de vuelta, {user.name}! 👋
              </h1>
              <p className="text-cyan-100">
                Has iniciado sesión correctamente. Sistema operativo y monitoreando.
              </p>
            </div>
            <Shield className="w-20 h-20 text-white/20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Attacks */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-red-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{summary.totalAttacks}</h3>
            <p className="text-slate-400 text-sm">Ataques Totales</p>
            <div className="mt-3 text-xs text-red-400">+12% vs. ayer</div>
          </div>

          {/* Active Threats */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              {summary.activeThreats > 0 && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{summary.activeThreats}</h3>
            <p className="text-slate-400 text-sm">Amenazas Activas</p>
            <div className="mt-3 text-xs text-yellow-400">Requieren atención</div>
          </div>

          {/* Mitigation Rules */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{summary.mitigationRules}</h3>
            <p className="text-slate-400 text-sm">Reglas de Mitigación</p>
            <div className="mt-3 text-xs text-green-400">Todas activas</div>
          </div>

          {/* Active Connections */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6 text-cyan-400" />
              </div>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{summary.activeConnections}</h3>
            <p className="text-slate-400 text-sm">Conexiones Activas</p>
            <div className="mt-3 text-xs text-cyan-400">En tiempo real</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users Management */}
              <Link to="/dashboard/users" className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Gestión de Usuarios</h3>
                    <p className="text-sm text-slate-400">Administra usuarios del sistema</p>
                  </div>
                </div>
              </Link>

              {/* Mitigation */}
              <Link to="/dashboard/mitigation" className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Mitigación</h3>
                    <p className="text-sm text-slate-400">Gestiona reglas de seguridad</p>
                  </div>
                </div>
              </Link>

              {/* Attack Monitor */}
              <Link to="/dashboard/attacks" className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-red-500/50 transition-all group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Monitor de Ataques</h3>
                    <p className="text-sm text-slate-400">Visualiza ataques en tiempo real</p>
                  </div>
                </div>
              </Link>

              {/* Real-time Traffic */}
              <Link to="/dashboard/traffic" className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Network className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">Tráfico en Tiempo Real</h3>
                    <p className="text-sm text-slate-400">Monitor de red en vivo</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start space-x-3 pb-4 border-b border-slate-700/50 last:border-0 last:pb-0"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(activity.severity)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white mb-1">{activity.message}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                Ver todo el registro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDSDashboard;