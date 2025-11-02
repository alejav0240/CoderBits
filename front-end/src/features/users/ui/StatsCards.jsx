import React, { useState } from "react";
import {
  Shield,
  Users,
  UserCheck,
} from "lucide-react";

export default function StatsCards({ users }) {
  const stats = {
    total: users.length,
    active: users.filter((u) => u.activo).length,
    admins: users.filter((u) => u.rol === 1).length,
    operators: users.filter((u) => u.rol === 2).length,
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Total Usuarios</div>
          </div>
          <Users className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {stats.active}
            </div>
            <div className="text-xs text-slate-400">Activos</div>
          </div>
          <UserCheck className="w-8 h-8 text-green-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-400">
              {stats.admins}
            </div>
            <div className="text-xs text-slate-400">Administradores</div>
          </div>
          <Shield className="w-8 h-8 text-red-400" />
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.operators}
            </div>
            <div className="text-xs text-slate-400">Operadores</div>
          </div>
          <UserCheck className="w-8 h-8 text-blue-400" />
        </div>
      </div>
    </div>
  );
}
