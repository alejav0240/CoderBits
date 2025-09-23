import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trafficService } from '../api/trafficService';
import { useTraffic } from '../hooks/useTraffic';

const RealTimeTraffic = () => {
    const { trafficData, topTraffic, networkStatus, isConnected, loading } = useTraffic();

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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
            <div className="col-12 mb-3">
                <div className={`alert ${isConnected ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                    <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'} me-2`}></div>
                    <div>
                        <strong>Estado:</strong> {isConnected ? 'Conectado en tiempo real' : 'Modo demostración'}
                        {!isConnected && <span className="ms-2">(Datos simulados)</span>}
                    </div>
                </div>
            </div>

            {/* Estadísticas de red */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Estado de la Red</h5>
                    </div>
                    <div className="card-body">
                        <div className="row text-center">
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-primary mb-1">{networkStatus.totalConnections}</div>
                                    <small className="text-muted">Conexiones Totales</small>
                                </div>
                            </div>
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-success mb-1">{networkStatus.activeConnections}</div>
                                    <small className="text-muted">Conexiones Activas</small>
                                </div>
                            </div>
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-info mb-1">{networkStatus.bandwidthUsage}</div>
                                    <small className="text-muted">Uso de Ancho de Banda</small>
                                </div>
                            </div>
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-warning mb-1">{networkStatus.latency}</div>
                                    <small className="text-muted">Latencia</small>
                                </div>
                            </div>
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-danger mb-1">{networkStatus.packetLoss}</div>
                                    <small className="text-muted">Pérdida de Paquetes</small>
                                </div>
                            </div>
                            <div className="col-md-2 mb-3">
                                <div className="border rounded p-3">
                                    <div className="h4 text-secondary mb-1">{trafficData.length}</div>
                                    <small className="text-muted">Puntos de Datos</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico en tiempo real */}
            <div className="col-md-8 mb-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Tráfico en Tiempo Real</h5>
                        <span className="badge bg-primary">Actualizando cada 3s</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trafficData.slice(-20)}> {/* Mostrar últimos 20 puntos */}
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value, name) => {
                                        if (name === 'bytes') return [formatBytes(value), 'Bytes'];
                                        if (name === 'packets') return [value.toLocaleString(), 'Paquetes'];
                                        return [value, name];
                                    }}
                                    labelFormatter={(label) => `Hora: ${label}`}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="bytes" 
                                    stroke="#8884d8" 
                                    strokeWidth={2} 
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="Bytes"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="packets" 
                                    stroke="#82ca9d" 
                                    strokeWidth={2} 
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="Paquetes"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top tráfico */}
            <div className="col-md-4 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Top 5 Flujos de Tráfico</h5>
                    </div>
                    <div className="card-body">
                        <div className="list-group">
                            {topTraffic.map((item, index) => (
                                <div key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="fw-bold text-primary">#{index + 1}</div>
                                            <small className="text-muted">{item.protocol}</small>
                                        </div>
                                        <div className="flex-grow-1 mx-3">
                                            <div className="fw-bold">{item.source}</div>
                                            <small className="text-muted">→ {item.destination}</small>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-success">{formatBytes(item.bytes)}</div>
                                            <small className="text-muted">tráfico</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h6 className="mb-0">Información del Sistema</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <small className="text-muted">
                                    <strong>Última actualización:</strong> {new Date().toLocaleString()}
                                </small>
                            </div>
                            <div className="col-md-6 text-end">
                                <small className="text-muted">
                                    <strong>Modo:</strong> {isConnected ? 'Tiempo Real' : 'Demostración'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimeTraffic;