import React, { useState } from "react";
import { useMitigaciones } from "../../../services/query/useMitigations";
import MitigationCard from "./MitigationCard";
import MitigationFilters from "./MitigationFilters";
import Pagination from "../../../shared/ui/Pagination";
import StatsCards from "./StatsCards";
import { AlertTriangle } from "lucide-react";

const MitigationList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({ page, limit });

  const { data, isLoading, isError, error } = useMitigaciones(filters);

  if (isLoading) return <div>Cargando mitigaciones...</div>;
  if (isError) return <div>Error: {error.message ? error.message : "Error desconocido"}</div>;

  const mitigations = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 10);

  console.log("Mitigaciones cargadas:", mitigations);
  const stats = {
    total: mitigations.length,
    active: mitigations.filter((m) => m.activo).length,
    success: mitigations.filter((m) => m.resultado === "Éxito").length,
    pending: mitigations.filter((m) => m.resultado === "Pendiente").length,
  };

  const applyMitigation = (mitigationId) => {
    console.log("Aplicar mitigación", mitigationId);
    // aquí podrías usar un useMutation para aplicar la mitigación
  };

  return (
    <div>
      <StatsCards stats={stats} />
      <MitigationFilters
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />

      {mitigations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mitigations.map((mitigation) => (
            <MitigationCard
              key={mitigation.id}
              mitigation={mitigation}
              onApply={applyMitigation}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No se encontraron mitigaciones
          </h3>
          <p className="text-slate-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}

      {mitigations.length > 0 && false && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
};

export default MitigationList;
