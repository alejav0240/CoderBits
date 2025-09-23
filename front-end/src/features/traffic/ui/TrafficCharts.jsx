import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { trafficService } from '../api/trafficService';

const TrafficCharts = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [timeRange, setTimeRange] = useState('1h');
    const [loading, setLoading] = useState(false);

    const fetchTrafficData = async (range = timeRange) => {
        setLoading(true);
        try {
            // Datos de ejemplo para demostración
            const mockData = generateMockTrafficData(range);
            setTrafficData(mockData);
            
            // Para producción, descomentar:
            // const data = await trafficService.getTrafficHistory(range);
            // setTrafficData(data);
        } catch (error) {
            console.error('Error fetching traffic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateMockTrafficData = (range) => {
        const data = [];
        const now = new Date();
        let points = 60; // 1 hora por defecto
        
        if (range === '24h') points = 24;
        if (range === '7d') points = 7;
        
        for (let i = points; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * (range === '7d' ? 24 * 3600000 : range === '24h' ? 3600000 : 60000));
            data.push({
                timestamp: range === '7d' ? timestamp.toLocaleDateString() : timestamp.toLocaleTimeString(),
                bytes: Math.floor(Math.random() * 1000000) + 500000,
                packets: Math.floor(Math.random() * 10000) + 1000,
                connections: Math.floor(Math.random() * 500) + 50
            });
        }
        return data;
    };

    useEffect(() => {
        fetchTrafficData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos de tráfico...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Historial de Tráfico</h5>
                        <select 
                            className="form-select form-select-sm" 
                            style={{ width: 'auto' }}
                            value={timeRange}
                            onChange={(e) => {
                                setTimeRange(e.target.value);
                                fetchTrafficData(e.target.value);
                            }}
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
                                <Tooltip 
                                    formatter={(value, name) => {
                                        if (name === 'bytes') return [`${(value / 1024 / 1024).toFixed(2)} MB`, 'Bytes'];
                                        if (name === 'packets') return [value.toLocaleString(), 'Paquetes'];
                                        return [value, name];
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="bytes" 
                                    stroke="#8884d8" 
                                    strokeWidth={2} 
                                    dot={false}
                                    name="Bytes"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="packets" 
                                    stroke="#82ca9d" 
                                    strokeWidth={2} 
                                    dot={false}
                                    name="Paquetes"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Conexiones Activas</h5>
                    </div>
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
                    <div className="card-header">
                        <h5 className="mb-0">Resumen de Tráfico</h5>
                    </div>
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