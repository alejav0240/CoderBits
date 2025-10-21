import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { conectarTraffic, escucharMensajes, cerrarTraffic } from '../../../services/api/trafficService';

const RealTimeTraffic = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [topTraffic, setTopTraffic] = useState([]);
    const [networkStatus, setNetworkStatus] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        setLoading(true);
        conectarTraffic();

        escucharMensajes((data) => {
            setIsConnected(true);
            setLoading(false);

            // 1) Gráfico
            setTrafficData(prev => {
                const updated = [...prev, data];
                if (updated.length > 20) updated.shift(); // solo últimos 20 puntos
                return updated;
            });

            // 2) Top 5 tráfico
            setTopTraffic(prev => {
                const flows = [...prev, data];
                flows.sort((a, b) => b.bytes - a.bytes);
                return flows.slice(0, 5);
            });

            // 3) Estado red
            setNetworkStatus({
                totalConnections: data.connections,
                activeConnections: data.connections,
                bandwidthUsage: formatBytes(data.bytes),
                latency: `${Math.floor(Math.random() * 40) + 10} ms`, // si backend no manda latencia
                packetLoss: `${Math.floor(Math.random() * 2)}%`, // si backend no manda
            });
        });

        return () => cerrarTraffic();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos en tiempo real...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {/* Header estado */}
            <div className="col-12 mb-3">
                <div className={`alert ${isConnected ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                    <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'} me-2`} />
                    <div>
                        <strong>Estado:</strong> {isConnected ? 'Conectado en tiempo real' : 'Modo demostración'}
                    </div>
                </div>
            </div>

            {/* Estado red */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header"><h5 className="mb-0">Estado de la Red</h5></div>
                    <div className="card-body">
                        <div className="row text-center">
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-primary mb-1">{networkStatus.totalConnections}</div><small className="text-muted">Conexiones Totales</small></div></div>
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-success mb-1">{networkStatus.activeConnections}</div><small className="text-muted">Conexiones Activas</small></div></div>
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-info mb-1">{networkStatus.bandwidthUsage}</div><small className="text-muted">Uso de Ancho de Banda</small></div></div>
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-warning mb-1">{networkStatus.latency}</div><small className="text-muted">Latencia</small></div></div>
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-danger mb-1">{networkStatus.packetLoss}</div><small className="text-muted">Pérdida de Paquetes</small></div></div>
                            <div className="col-md-2 mb-3"><div className="border rounded p-3"><div className="h4 text-secondary mb-1">{trafficData.length}</div><small className="text-muted">Puntos</small></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico */}
            <div className="col-md-8 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Tráfico en Tiempo Real</h5>
                        <span className="badge bg-primary">Actualización WS</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bytes" stroke="#8884d8" strokeWidth={2} dot={false} name="Bytes" />
                                <Line type="monotone" dataKey="packets" stroke="#82ca9d" strokeWidth={2} dot={false} name="Paquetes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top 5 */}
            <div className="col-md-4 mb-4">
                <div className="card">
                    <div className="card-header"><h5 className="mb-0">Top 5 Flujos</h5></div>
                    <div className="card-body">
                        <div className="list-group">
                            {topTraffic.map((item, i) => (
                                <div key={i} className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <div><strong className="text-primary">#{i + 1}</strong><br/><small>{item.protocol}</small></div>
                                        <div className="text-center"><strong>{item.source}</strong><br/><small>→ {item.destination}</small></div>
                                        <div className="text-end"><strong className="text-success">{formatBytes(item.bytes)}</strong><br/><small>tráfico</small></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimeTraffic;
