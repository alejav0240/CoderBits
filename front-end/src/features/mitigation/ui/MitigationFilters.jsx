import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const MitigationFilters = ({ onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [activo, setActivo] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ search, activo });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={activo}
          onChange={(e) => setActivo(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activas</option>
          <option value="false">Desactivadas</option>
        </select>
        <div>
          
        </div>

        {/* Result Filter 
        <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="all">Todos los resultados</option>
          <option value="Éxito">Éxito</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Error">Error</option>
        </select>
        */}

        {/* Apply Filters Button */}
        <button
          onClick={handleFilterChange}
          className="from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default MitigationFilters;
