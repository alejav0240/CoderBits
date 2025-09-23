import React from 'react';
import RealTimeTraffic from '../features/traffic/ui/RealTimeTraffic';
import TrafficCharts from '../features/traffic/ui/TrafficCharts';

const TrafficPage = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-soft border-0 mb-4">
                        <div className="card-header bg-white py-4">
                            <h1 className="h2 mb-0">🌐 Monitor de Tráfico en Tiempo Real</h1>
                            <p className="text-muted mb-0">Visualización en tiempo real del tráfico de red y análisis de flujos</p>
                        </div>
                        <div className="card-body p-4">
                            <RealTimeTraffic />
                        </div>
                    </div>
                    
                    <div className="card shadow-soft border-0">
                        <div className="card-header bg-white py-4">
                            <h3 className="h4 mb-0">📊 Análisis Histórico de Tráfico</h3>
                            <p className="text-muted mb-0">Estadísticas y tendencias del tráfico de red</p>
                        </div>
                        <div className="card-body p-4">
                            <TrafficCharts />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrafficPage;