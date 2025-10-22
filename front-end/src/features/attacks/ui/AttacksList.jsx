import React, { useState, useEffect } from "react";
import { useAttacks } from "../../../services/query/useAttacks";
import AttacksCard from "./AttacksCard";
import Pagination from "../../../shared/ui/Pagination";
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

const AttacksList = ({ range }) => {
  const [severityFilter, setSeverityFilter] = useState("all");
  const { data, isLoading, isError, error } = useAttacks(range);

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        color: "red",
        label: "Crítico",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-400",
      },
      high: {
        color: "orange",
        label: "Alto",
        bg: "bg-orange-500/20",
        border: "border-orange-500/30",
        text: "text-orange-400",
      },
      medium: {
        color: "yellow",
        label: "Medio",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
      },
      low: {
        color: "blue",
        label: "Bajo",
        bg: "bg-blue-500/20",
        border: "border-blue-500/30",
        text: "text-blue-400",
      },
    };
    return configs[severity] || configs.low;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Cargando datos de ataques...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
        role="alert"
      >
        <svg
          class="shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div>
          <span class="font-medium">{error.name}</span> {error.message}
        </div>
      </div>
    );
  }

  // Si el backend devuelve algo como { attacks: [], total: ... }
  const attacks = data || [];
  const total = data?.total || attacks.length;

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Lista de Ataques Detectados</span>
          </h2>
          <p className="text-sm text-slate-400">
            Total: {attacks.length} ataques
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todas las severidades</option>
            <option value="critical">Crítico</option>
            <option value="high">Alto</option>
            <option value="medium">Medio</option>
            <option value="low">Bajo</option>
          </select>
        </div>
      </div>

      {attacks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {attacks.map((attack) => {
            const severityConfig = getSeverityConfig(attack.severidad);
            return (
              <div
                key={attack.id}
                className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-red-500/50 transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {attack.tipo}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {attack.descripcion}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 ${severityConfig.bg} border ${severityConfig.border} rounded-full text-xs ${severityConfig.text} font-medium`}
                  >
                    {severityConfig.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">IP Origen:</span>
                    <span className="text-cyan-400 font-mono">
                      {attack.ip_origen}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">IP Destino:</span>
                    <span className="text-blue-400 font-mono">
                      {attack.ip_destino}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Puerto Destino:</span>
                    <span className="text-slate-300 font-mono">
                      {attack.puerto_destino}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-300 text-xs">
                      {new Date(attack.timestamp).toLocaleString("es-ES")}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    {attack.bloqueado ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-400 font-medium">
                          Bloqueado
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-yellow-400 font-medium">
                          Sin bloquear
                        </span>
                      </>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No se detectaron ataques
          </h3>
          <p className="text-slate-400">
            No hay actividades maliciosas registradas en el período
            seleccionado.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttacksList;
