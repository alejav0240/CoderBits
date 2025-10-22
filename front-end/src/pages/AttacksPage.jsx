import React from "react";
import AttacksList from "../features/attacks/ui/AttacksList";
import AttacksCharts from "../features/attacks/ui/AttacksCharts";
import { Shield, AlertTriangle, Activity, TrendingUp, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";


const AttacksPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">
                Sistema IDS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                Dashboard
              </Link>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <span>Monitor de Ataques</span>
          </h1>
          <p className="text-slate-400">
            Visualización en tiempo real de actividades maliciosas
          </p>
        </div>
        <AttacksCharts />

        <AttacksList />
      </div>
    </div>
  );
};

export default AttacksPage;
