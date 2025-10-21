import React from 'react';

const AttacksCard = ({ attack }) => {
    // Asignar colores según la criticidad del ataque
    const getSeverityColor = (tipo) => {
        const mapping = {
            'DoS': 'danger',
            'Malware': 'warning',
            'Intrusion': 'info',
            'Phishing': 'secondary',
        };
        return mapping[tipo] || 'secondary';
    };

    // Asignar un icono según el tipo de ataque
    const getTypeIcon = (tipo) => {
        const icons = {
            'DoS': '🌐',
            'Malware': '🦠',
            'Intrusion': '🚨',
            'Phishing': '🎣',
        };
        return icons[tipo] || '⚡';
    };

    return (
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span className="me-2 fs-5">{getTypeIcon(attack.tipo)}</span>
                    <h6 className="mb-0 text-truncate">{attack.tipo}</h6>
                </div>
                <span className={`badge bg-${getSeverityColor(attack.tipo)}`}>
                    {attack.activo ? 'Activo' : 'Mitigado'}
                </span>
            </div>

            <div className="card-body">
                <p className="card-text small text-muted">{attack.descripcion}</p>

                <div className="row small">
                    <div className="col-6">
                        <strong>IP Origen:</strong>
                        <div className="text-truncate" title={attack.ip_origen}>
                            {attack.ip_origen}
                        </div>
                    </div>
                    <div className="col-6">
                        <strong>IP Destino:</strong>
                        <div className="text-truncate" title={attack.ip_destino}>
                            {attack.ip_destino}:{attack.puerto}
                        </div>
                    </div>
                </div>

                <div className="mt-2 d-flex justify-content-between small">
                    <span>Conexiones:</span>
                    <strong>{attack.conteo_conexiones?.toLocaleString() || 0}</strong>
                </div>
            </div>

            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                <small className="text-muted">
                    {new Date(attack.fecha_detectado).toLocaleString()}
                </small>
                <small className={`text-${attack.activo ? 'warning' : 'success'}`}>
                    {attack.activo ? '⚠️ Activo' : '🛡️ Mitigado'}
                </small>
            </div>
        </div>
    );
};

export default AttacksCard;
