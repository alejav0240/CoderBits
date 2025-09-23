import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { attacksService } from '../api/attacksService';

const AttacksCharts = () => {
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [loading, setLoading] = useState(false);

    const fetchStats = async (range = timeRange) => {
        setLoading(true);
        try {
            const data = await attacksService.getAttackStats(range);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    if (loading) return <div>Cargando estadísticas...</div>;
    if (!stats) return <div>No hay datos disponibles</div>;

    return (
        <div className="row">
            <div className="col-md-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5>Ataques por Hora</h5>
                        <select 
                            value={timeRange} 
                            onChange={(e) => {
                                setTimeRange(e.target.value);
                                fetchStats(e.target.value);
                            }}
                        >
                            <option value="1h">Última hora</option>
                            <option value="24h">Últimas 24h</option>
                            <option value="7d">Últimos 7 días</option>
                        </select>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.hourly}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5>Ataques por Tipo</h5>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.byType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.byType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h5>Severidad de Ataques</h5>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.bySeverity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="severity" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttacksCharts;