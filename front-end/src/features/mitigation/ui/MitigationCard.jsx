import React, { useState } from 'react';

const MitigationCard = ({ mitigation, onApply }) => {
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        setIsApplying(true);
        try {
            await onApply(mitigation.id);
        } catch (error) {
            console.error('Error applying mitigation:', error);
        } finally {
            setIsApplying(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { class: 'bg-success', text: 'Activa' },
            pending: { class: 'bg-warning', text: 'Pendiente' },
            disabled: { class: 'bg-secondary', text: 'Desactivada' },
            error: { class: 'bg-danger', text: 'Error' }
        };
        
        const config = statusConfig[status] || statusConfig.disabled;
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const getSeverityBadge = (severity) => {
        const severityConfig = {
            high: { class: 'bg-danger', text: 'Alta' },
            medium: { class: 'bg-warning', text: 'Media' },
            low: { class: 'bg-info', text: 'Baja' }
        };
        
        const config = severityConfig[severity] || severityConfig.medium;
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{mitigation.name}</h6>
                {getStatusBadge(mitigation.status)}
            </div>
            
            <div className="card-body">
                <p className="card-text small">{mitigation.description}</p>
                
                <div className="mb-2">
                    <strong>Tipo:</strong> {mitigation.type}
                </div>
                
                <div className="mb-2">
                    <strong>Severidad:</strong> {getSeverityBadge(mitigation.severity)}
                </div>
                
                <div className="mb-2">
                    <strong>Reglas:</strong> {mitigation.ruleCount || 0}
                </div>
                
                {mitigation.lastApplied && (
                    <div className="mb-2">
                        <strong>Última aplicación:</strong> 
                        <br/>
                        <small className="text-muted">
                            {new Date(mitigation.lastApplied).toLocaleString()}
                        </small>
                    </div>
                )}
            </div>
            
            <div className="card-footer bg-white">
                <div className="d-grid gap-2">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleApply}
                        disabled={isApplying || mitigation.status === 'active'}
                    >
                        {isApplying ? 'Aplicando...' : 'Aplicar Mitigación'}
                    </button>
                    
                    {mitigation.source && (
                        <small className="text-center text-muted">
                            Fuente: {mitigation.source}
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MitigationCard;