import React, { useState } from 'react';
import { useMitigaciones } from '../../../services/query/useMitigations';
import MitigationCard from './MitigationCard';
import MitigationFilters from './MitigationFilters';
import Pagination from '../../../shared/ui/Pagination';

const MitigationList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({});

    const { data, isLoading, isError, error } = useMitigaciones(page, limit, filters);

    const mitigations = data || [];
    const pagination = data?.pagination || {};

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // reset página al aplicar filtros
    };

    const applyMitigation = (mitigationId) => {
        console.log('Aplicar mitigación', mitigationId);
        // aquí podrías usar un useMutation para aplicar la mitigación
    };

    if (isLoading) return <div>Cargando mitigaciones...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            <MitigationFilters filters={filters} onFilterChange={applyFilters} />

            <div className="row">
                {mitigations.length > 0 ? mitigations.map(mitigation => (
                    <div key={mitigation.id} className="col-md-6 col-lg-4 mb-3">
                        <MitigationCard 
                            mitigation={mitigation} 
                            onApply={applyMitigation}
                        />
                    </div>
                )) : (
                    <p>No hay mitigaciones para mostrar.</p>
                )}
            </div>

            {mitigations.length > 0 && (
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
