import React, { useState } from "react";
import api from "../../../utils/axios";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Activity,
} from "lucide-react";

const MitigationCard = ({ mitigation, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Función que hace POST a /activar o /desactivar según el estado actual
  const handleApplyMitigation = async (id) => {
    setIsLoading(true);
    const action = mitigation.activo ? "desactivar" : "activar";

    try {
      // Petición POST con api
      const response = await api.post(`/mitigaciones/${id}/${action}/`);

      console.log(`✅ Mitigación ${action} - Respuesta:`, response.data);

      // Actualizar estado en el componente padre si existe
      if (onStatusChange) {
        onStatusChange(id, action);
      }
    } catch (error) {
      console.error(`❌ Error al ${action} mitigación:`, error);
      alert(`Error al ${action} la mitigación: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Badge del estado (activa o desactivada)
  const getStatusBadge = (activo) => {
    return activo ? (
      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-medium flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Activa</span>
      </span>
    ) : (
      <span className="px-3 py-1 bg-slate-500/20 border border-slate-500/30 rounded-full text-xs text-slate-400 font-medium flex items-center space-x-1">
        <XCircle className="w-3 h-3" />
        <span>Desactivada</span>
      </span>
    );
  };

  // 🔹 Badge del resultado
  const getResultBadge = (resultado) => {
    const configs = {
      Éxito: { color: "green", icon: CheckCircle },
      Error: { color: "red", icon: XCircle },
      Pendiente: { color: "yellow", icon: Clock },
    };
    const config = configs[resultado] || {
      color: "slate",
      icon: AlertTriangle,
    };
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 bg-${config.color}-500/20 border border-${config.color}-500/30 rounded-full text-xs text-${config.color}-400 font-medium flex items-center space-x-1`}
      >
        <Icon className="w-3 h-3" />
        <span>{resultado}</span>
      </span>
    );
  };

  return (
    <div
      key={mitigation.id}
      className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group"
    >
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700/50 p-4 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm line-clamp-1">
          {mitigation.detalle}
        </h3>
        {getStatusBadge(mitigation.activo)}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-sm text-slate-400">IP:</span>
          <span className="text-sm text-white font-mono">{mitigation.ip}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Resultado:</span>
          {getResultBadge(mitigation.resultado)}
        </div>

        {mitigation.fecha_mitigacion && (
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-400">Última aplicación:</div>
              <div className="text-xs text-slate-300">
                {new Date(mitigation.fecha_mitigacion).toLocaleString("es-ES")}
              </div>
            </div>
          </div>
        )}

        {mitigation.ejecutado_por && (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-xs text-slate-400">Por:</span>
            <span className="text-xs text-slate-300 font-mono">
              {mitigation.ejecutado_por}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-700/50 p-4">
        <button
          onClick={() => handleApplyMitigation(mitigation.id)}
          disabled={isLoading}
          className={`w-full bg-gradient-to-r ${
            mitigation.activo
              ? "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              : "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          } disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm disabled:cursor-not-allowed`}
        >
          {isLoading
            ? "Procesando..."
            : mitigation.activo
            ? "Desactivar Mitigación"
            : "Activar Mitigación"}
        </button>
      </div>
    </div>
  );
};

export default MitigationCard;
