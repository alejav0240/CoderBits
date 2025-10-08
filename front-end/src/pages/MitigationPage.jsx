import React from 'react';
import MitigationList from '../features/mitigation/ui/MitigationList';

const MitigationPage = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-soft border-0">
                        <div className="card-header bg-white py-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="h2 mb-0">🛡️ Gestión de Mitigaciones</h1>
                                    <p className="text-muted mb-0">Administra las reglas de seguridad y protección</p>
                                </div>
                                <span className="badge bg-primary fs-6">Sistema Activo</span>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <MitigationList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MitigationPage;