import React, { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";

export default function Filters({ setFilters, setPage, openCreateModal }) {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    rol: "all",
    activo: "all",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Cuando los filtros cambian, actualiza el estado en UserList (padre)
    setFilters(localFilters);
    // Vuelve a la primera página con los nuevos filtros
    setPage(1);
  }, [localFilters, setFilters, setPage]);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Filtros</h2>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="search"
            placeholder="Buscar por nombre, email o usuario..."
            value={localFilters.search}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <select
          name="rol"
          value={localFilters.rol}
          onChange={handleChange}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="operator">Operador</option>
          <option value="user">Usuario</option>
        </select>

        <select
          name="activo"
          value={localFilters.activo}
          onChange={handleChange}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>
    </div>
  );
}