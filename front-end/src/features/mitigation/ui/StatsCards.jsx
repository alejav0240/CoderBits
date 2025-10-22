import React, { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Activity,
} from "lucide-react";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Total Reglas</div>
          </div>
          <Activity className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {stats.active}
            </div>
            <div className="text-xs text-slate-400">Activas</div>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.success}
            </div>
            <div className="text-xs text-slate-400">Exitosas</div>
          </div>
          <CheckCircle className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.pending}
            </div>
            <div className="text-xs text-slate-400">Pendientes</div>
          </div>
          <Clock className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
    </div>
  );
}
