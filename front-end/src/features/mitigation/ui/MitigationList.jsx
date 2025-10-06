import React from 'react';
import { useMitigations } from '../hooks/useMitigations';
import MitigationCard from './MitigationCard';
import MitigationFilters from './MitigationFilters';
import Pagination from '../../../shared/ui/Pagination';

const MitigationList = () => {
    const { 
        mitigations, 
        loading, 
        error, 
        pagination, 
        filters,
        applyFilters,
        applyMitigation,
        changePage, 
        changeLimit 
    } = useMitigations();

    if (loading) return <div>Cargando mitigaciones...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <MitigationFilters filters={filters} onFilterChange={applyFilters} />
            
            <div className="row">
                {mitigations.map(mitigation => (
                    <div key={mitigation.id} className="col-md-6 col-lg-4 mb-3">
                        <MitigationCard 
                            mitigation={mitigation} 
                            onApply={applyMitigation}
                        />
                    </div>
                ))}
            </div>

            <Pagination 
                pagination={pagination}
                onPageChange={changePage}
                onLimitChange={changeLimit}
            />
        </div>
    );
};

export default MitigationList;