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

    const getStatusBadge = (activo) => {
        return activo 
            ? <span className="badge bg-success">Activa</span>
            : <span className="badge bg-secondary">Desactivada</span>;
    };

    const getResultBadge = (resultado) => {
        if (!resultado) return null;
        const colors = {
            Éxito: 'bg-success',
            Error: 'bg-danger',
            Pendiente: 'bg-warning'
        };
        const colorClass = colors[resultado] || 'bg-secondary';
        return <span className={`badge ${colorClass}`}>{resultado}</span>;
    };

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{mitigation.detalle}</h6>
                {getStatusBadge(mitigation.activo)}
            </div>

            <div className="card-body">
                <div className="mb-2">
                    <strong>IP:</strong> {mitigation.ip}
                </div>

                <div className="mb-2">
                    <strong>Resultado:</strong> {getResultBadge(mitigation.resultado)}
                </div>

                {mitigation.fecha_mitigacion && (
                    <div className="mb-2">
                        <strong>Última aplicación:</strong>
                        <br />
                        <small className="text-muted">
                            {new Date(mitigation.fecha_mitigacion).toLocaleString()}
                        </small>
                    </div>
                )}

                {mitigation.ejecutado_por && (
                    <div className="mb-2">
                        <strong>Ejecutado por ID:</strong> {mitigation.ejecutado_por}
                    </div>
                )}
            </div>

            <div className="card-footer bg-white">
                <div className="d-grid gap-2">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleApply}
                        disabled={isApplying || mitigation.activo}
                    >
                        {isApplying ? 'Aplicando...' : 'Aplicar Mitigación'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MitigationCard;
