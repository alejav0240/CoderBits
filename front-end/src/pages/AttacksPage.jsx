import React from 'react';
import AttacksList from '../features/attacks/ui/AttacksList';
import AttacksCharts from '../features/attacks/ui/AttacksCharts';

const AttacksPage = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-soft border-0 mb-4">
                        <div className="card-header bg-white py-4">
                            <h1 className="h2 mb-0">⚔️ Monitor de Ataques</h1>
                            <p className="text-muted mb-0">Visualización en tiempo real de actividades maliciosas</p>
                        </div>
                        <div className="card-body p-4">
                            <AttacksCharts />
                        </div>
                    </div>
                    
                    <div className="card shadow-soft border-0">
                        <div className="card-body p-4">
                            <AttacksList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttacksPage;