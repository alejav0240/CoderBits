import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { conectarTraffic, escucharMensajes, cerrarTraffic } from '../../../services/api/trafficService';

const TrafficCharts = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [timeRange, setTimeRange] = useState('1h');

    useEffect(() => {
        conectarTraffic();

        // Recibe datos del socket
        escucharMensajes((data) => {
            setTrafficData((prev) => {
                const updated = [...prev, data];

                // limitador según timeRange
                if (timeRange === '1h' && updated.length > 60) updated.shift();
                if (timeRange === '24h' && updated.length > 24) updated.shift();
                if (timeRange === '7d' && updated.length > 7) updated.shift();

                return updated;
            });
        });

        return () => {
            cerrarTraffic();
        };
    }, [timeRange]);

    return (
        <div className="row">
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Historial de Tráfico (Tiempo Real)</h5>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="1h">Última hora</option>
                            <option value="24h">Últimas 24h</option>
                            <option value="7d">Últimos 7 días</option>
                        </select>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
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

            <div className="col-md-6 mb-4">
                <div className="card">
                    <div className="card-header"><h5 className="mb-0">Conexiones Activas</h5></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trafficData.slice(-10)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="connections" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6 mb-4">
                <div className="card">
                    <div className="card-header"><h5 className="mb-0">Resumen de Tráfico</h5></div>
                    <div className="card-body">
                        {trafficData.length > 0 && (
                            <div className="row text-center">
                                <div className="col-4">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-primary mb-1">
                                            {(trafficData.reduce((sum, item) => sum + item.bytes, 0) / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                        <small className="text-muted">Total Bytes</small>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-success mb-1">
                                            {trafficData.reduce((sum, item) => sum + item.packets, 0).toLocaleString()}
                                        </div>
                                        <small className="text-muted">Total Paquetes</small>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-warning mb-1">
                                            {Math.max(...trafficData.map(item => item.connections))}
                                        </div>
                                        <small className="text-muted">Máx. Conexiones</small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrafficCharts;
