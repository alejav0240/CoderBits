import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, Lock, Eye, Bell, TrendingUp, Server, Users, CheckCircle } from 'lucide-react';

const HomePage = () => {
  
  const { user } = useAuth();
  
  // Simulación de stats en tiempo real
  const [stats] = useState({
    threats: 127,
    blocked: 1849,
    monitored: 45,
    uptime: 99.8
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header/Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Sistema IDS</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-300">{user.email}</span>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">Sistema Operativo - Monitoreo Activo</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Protección Inteligente
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                24/7 en Tiempo Real
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Sistema avanzado de detección de intrusos con IA. Monitorea, analiza y 
              neutraliza amenazas antes de que comprometan tu infraestructura.
            </p>

            {user ? (
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-6 py-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300">Sesión activa como <strong>{user.email}</strong></span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Panel de Control</span>
                  </button>
                  <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Ver Alertas</span>
                  </button>
                  <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all hover:scale-105 flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Monitoreo en Vivo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-400">
                  Accede al sistema para comenzar a proteger tu red
                </p>
                < Link
                  to="/login"
                  className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </Link>
              </div>
            )}
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{stats.threats}</div>
              <div className="text-sm text-slate-400">Amenazas Detectadas (Hoy)</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.blocked}</div>
              <div className="text-sm text-slate-400">Ataques Bloqueados</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.monitored}</div>
              <div className="text-sm text-slate-400">Dispositivos Monitoreados</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.uptime}%</div>
              <div className="text-sm text-slate-400">Tiempo de Actividad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Capacidades Avanzadas</h2>
            <p className="text-xl text-slate-400">Tecnología de vanguardia para máxima seguridad</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Detección de Anomalías</h3>
              <p className="text-slate-400 leading-relaxed">
                Algoritmos de ML que identifican patrones sospechosos y comportamientos 
                anómalos en tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Monitoreo en Tiempo Real</h3>
              <p className="text-slate-400 leading-relaxed">
                Dashboard interactivo con visualización de tráfico de red, eventos y 
                métricas actualizadas cada segundo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Alertas Inteligentes</h3>
              <p className="text-slate-400 leading-relaxed">
                Sistema de notificaciones multi-canal con clasificación automática 
                de severidad y respuesta sugerida.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Respuesta Automática</h3>
              <p className="text-slate-400 leading-relaxed">
                Acciones automatizadas para bloquear amenazas: firewall dinámico, 
                aislamiento y mitigación instantánea.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Análisis Predictivo</h3>
              <p className="text-slate-400 leading-relaxed">
                Predicción de vectores de ataque basada en tendencias históricas 
                y threat intelligence global.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Server className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Infraestructura Escalable</h3>
              <p className="text-slate-400 leading-relaxed">
                Arquitectura distribuida que crece con tu organización. 
                Soporta desde pequeñas redes hasta infraestructuras enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para proteger tu infraestructura?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Únete a miles de organizaciones que confían en Sistema IDS
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl">
              Solicitar Demo
            </button>
            <button className="px-8 py-4 bg-cyan-700 text-white rounded-xl font-bold hover:bg-cyan-800 transition-colors border-2 border-white/30">
              Contactar Ventas
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-slate-300">© 2025 Sistema IDS. Todos los derechos reservados.</span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Documentación</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Soporte</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;