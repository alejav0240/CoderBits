import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAnalytics } from "../../../services/query/useDashboard";
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

const AttacksCharts = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const { data: stats, isLoading, isError } = useAnalytics({ timeRange });

  const COLORS = [
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium">
            {payload[0].payload.hour || payload[0].name}
          </p>
          <p className="text-cyan-400 text-xs">Ataques: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Cargando estadísticas de ataques...</p>
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
          <span class="font-medium">{error?.name ? error.name : "Error"}</span> {error?.message}
        </div>
      </div>
    );
  }

  if (!stats)
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
          <span class="font-medium">No hay Datos disponibles </span>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <span>Análisis de Ataques</span>
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="1h">Última hora</option>
          <option value="24h">Últimas 24 horas</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Attacks per Hour */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Ataques por Hora</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="hour"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Ataques"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Attacks by Type */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Ataques por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.byType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Severity */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">
            Severidad de Ataques
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bySeverity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="severity"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#10b981" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default AttacksCharts;
