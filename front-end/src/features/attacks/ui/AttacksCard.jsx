import React from 'react';

const AttacksCard = ({ attack }) => {
    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'danger',
            high: 'warning',
            medium: 'info',
            low: 'secondary'
        };
        return colors[severity] || 'secondary';
    };

    const getTypeIcon = (type) => {
        const icons = {
            ddos: '🌐',
            malware: '🦠',
            intrusion: '🚨',
            phishing: '🎣',
            brute_force: '🔨',
            scanning: '🔍'
        };
        return icons[type] || '⚡';
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span className="me-2 fs-5">{getTypeIcon(attack.type)}</span>
                    <h6 className="mb-0 text-truncate">{attack.name}</h6>
                </div>
                <span className={`badge bg-${getSeverityColor(attack.severity)}`}>
                    {attack.severity}
                </span>
            </div>
            
            <div className="card-body">
                <p className="card-text small text-muted">{attack.description}</p>
                
                <div className="row small">
                    <div className="col-6">
                        <strong>Source:</strong>
                        <div className="text-truncate" title={attack.source}>
                            {attack.source}
                        </div>
                    </div>
                    <div className="col-6">
                        <strong>Target:</strong>
                        <div className="text-truncate" title={attack.target}>
                            {attack.target}
                        </div>
                    </div>
                </div>
                
                <div className="mt-2">
                    <div className="d-flex justify-content-between small">
                        <span>Paquetes:</span>
                        <strong>{attack.packets?.toLocaleString() || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between small">
                        <span>Tráfico:</span>
                        <strong>{formatBytes(attack.bytes || 0)}</strong>
                    </div>
                </div>
                
                {attack.signature && (
                    <div className="mt-2">
                        <small>
                            <strong>Firma:</strong> {attack.signature}
                        </small>
                    </div>
                )}
            </div>
            
            <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        {new Date(attack.timestamp).toLocaleString()}
                    </small>
                    <small className={`text-${attack.mitigated ? 'success' : 'warning'}`}>
                        {attack.mitigated ? '🛡️ Mitigado' : '⚠️ Activo'}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default AttacksCard;