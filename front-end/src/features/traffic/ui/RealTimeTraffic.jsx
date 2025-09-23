import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trafficService } from '../api/trafficService';

const RealTimeTraffic = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [topTraffic, setTopTraffic] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Cargar datos iniciales
        loadInitialData();

        // Configurar WebSocket
        const socket = trafficService.connectWebSocket((newData) => {
            setTrafficData(prev => {
                const updated = [...prev, { ...newData, timestamp: new Date().toLocaleTimeString() }];
                return updated.slice(-50); // Mantener solo últimos 50 puntos
            });
        });

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            trafficService.disconnectWebSocket();
        };
    }, []);

    const loadInitialData = async () => {
        try {
            const [topData, historyData] = await Promise.all([
                trafficService.getTopTraffic(10),
                trafficService.getTrafficHistory('1h')
            ]);
            setTopTraffic(topData);
            setTrafficData(historyData);
        } catch (error) {
            console.error('Error loading traffic data:', error);
        }
    };

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <div className="alert alert-info d-flex align-items-center">
                    <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'} me-2`}></div>
                    Estado: {isConnected ? 'Conectado en tiempo real' : 'Desconectado'}
                </div>
            </div>

            <div className="col-md-8 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5>Tráfico en Tiempo Real</h5>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bytes" stroke="#8884d8" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="packets" stroke="#82ca9d" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-4 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5>Top 10 Tráfico</h5>
                    </div>
                    <div className="card-body">
                        <div className="list-group">
                            {topTraffic.map((item, index) => (
                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted">#{index + 1}</small>
                                        <div className="fw-bold">{item.source}</div>
                                        <small className="text-muted">→ {item.destination}</small>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">
                                        {Math.round(item.bytes / 1024)} KB
                                    </span>
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