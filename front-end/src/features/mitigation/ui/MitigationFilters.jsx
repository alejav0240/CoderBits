import React from 'react';

const MitigationFilters = ({ filters, onFilterChange }) => {
    const handleFilterChange = (key, value) => {
        onFilterChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFilterChange({
            status: '',
            type: '',
            severity: ''
        });
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h6 className="mb-0">Filtros de Mitigación</h6>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Estado</label>
                        <select 
                            className="form-select"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="active">Activa</option>
                            <option value="pending">Pendiente</option>
                            <option value="disabled">Desactivada</option>
                        </select>
                    </div>
                    
                    <div className="col-md-3">
                        <label className="form-label">Tipo</label>
                        <select 
                            className="form-select"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="firewall">Firewall</option>
                            <option value="ips">IPS</option>
                            <option value="waf">WAF</option>
                            <option value="ddos">DDoS Protection</option>
                        </select>
                    </div>
                    
                    <div className="col-md-3">
                        <label className="form-label">Severidad</label>
                        <select 
                            className="form-select"
                            value={filters.severity}
                            onChange={(e) => handleFilterChange('severity', e.target.value)}
                        >
                            <option value="">Todas</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                        </select>
                    </div>
                    
                    <div className="col-md-3 d-flex align-items-end">
                        <button 
                            className="btn btn-outline-secondary w-100"
                            onClick={clearFilters}
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MitigationFilters;