import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useMitigaciones } from "../../../services/query/useMitigations";
import MitigationCard from "./MitigationCard";
import MitigationFilters from "./MitigationFilters";
import Pagination from "../../../shared/ui/Pagination";
import StatsCards from "./StatsCards";
import { AlertTriangle } from "lucide-react";

/**
 * ✅ MitigationList:
 * Muestra las mitigaciones con filtros, paginación y estadísticas globales.
 */
const MitigationList = () => {
  // Estado local para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [activeFilters, setActiveFilters] = useState({});

  // Construimos los parámetros combinando filtros + paginación
  const queryParams = useMemo(() => ({ ...activeFilters, page, limit }), [activeFilters, page, limit]);

  // Fetch de datos con React Query
  const { data, isLoading, isError, error, isFetching } = useMitigaciones(queryParams);

  // Datos base
  const mitigations = data?.results || [];
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Cálculo de estadísticas (memoizado para evitar recalcular en cada render)
  const stats = useMemo(() => ({
    total: totalItems,
    active: mitigations.filter((m) => m.activo).length,
    success: mitigations.filter((m) => m.resultado === "Éxito").length,
    pending: mitigations.filter((m) => m.resultado === "Pendiente").length,
  }), [mitigations, totalItems]);

  // Handler para cambio de filtros
  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setPage(1); // Reiniciamos la página al aplicar filtros
  }, []);

  // Handler para aplicar mitigación manualmente (placeholder)
  const applyMitigation = useCallback((mitigationId) => {
    console.log("Aplicar mitigación", mitigationId);
    // Aquí podrías usar un useMutation con React Query
  }, []);

  // Mensajes de carga y error
  if (isLoading) {
    return (
      <div className="text-center text-slate-400 py-12">
        Cargando mitigaciones...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-6 rounded-xl text-center">
        <p className="font-semibold">Error al cargar mitigaciones</p>
        <p className="text-sm mt-1">{error.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <StatsCards stats={stats} />

      {/* Filtros */}
      <MitigationFilters onFilterChange={handleFilterChange} />

      {/* Contenido principal */}
      {mitigations.length > 0 ? (
        <>
          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mitigations.map((mitigation) => (
              <MitigationCard
                key={mitigation.id}
                mitigation={mitigation}
                onApply={applyMitigation}
              />
            ))}
          </div>

          {/* Paginación */}
          <Pagination
            pagination={{
              currentPage: page,
              totalPages,
              itemsPerPage: limit,
            }}
            totalItems={totalItems}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />

          {/* Indicador sutil si se está actualizando sin recargar */}
          {isFetching && (
            <div className="text-xs text-slate-500 text-center mt-2 animate-pulse">
              Actualizando datos...
            </div>
          )}
        </>
      ) : (
        // Estado vacío
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No se encontraron mitigaciones
          </h3>
          <p className="text-slate-400">
            Intenta ajustar los filtros o cambiar el rango de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

export default MitigationList;
