import React, { useEffect, useState, useRef } from "react";
import { Shield, Activity, TrendingUp, AlertCircle, Network, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { conectarTraffic, escucharMensajes, cerrarTraffic } from '../../../services/api/trafficService';

const RealTimeTraffic = () => {
  const [trafficData, setTrafficData] = useState([]); // puntos para el gráfico (últimos N)
  const [topTraffic, setTopTraffic] = useState([]);   // top 5 agregado por flujo
  const [networkStatus, setNetworkStatus] = useState({
    totalConnections: 0,
    activeConnections: 0,
    bandwidthUsage: "0 B",
    latency: "N/A",
    packetLoss: "N/A",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // mapa en memoria para acumular por flujo (no re-render en cada operación)
  const topMapRef = useRef(new Map());

  // formatea bytes a KB/MB
  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "0 B";
    const b = Number(bytes) || 0;
    if (b === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return `${(b / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

useEffect(() => {
  setLoading(true);
  conectarTraffic();

  escucharMensajes((msg) => {
    console.log("Mensaje recibido desde escucharMensajes:", msg);

    try {
      if (!msg || msg.tipo_evento !== "conexion" || !msg.conexion) return;

      setIsConnected(true);
      setLoading(false);

      const c = msg.conexion;
      const bytes = Number(c.bytes ?? 0);
      const packets = Number(c.packets ?? 0);
      const ip_src = c.ip_src || c.ipSrc || "-";
      const ip_dst = c.ip_dst || c.ipDst || "-";
      const protocolo = c.protocolo || c.protocol || "-";
      const ts = c.timestamp || new Date().toISOString();
      const timeLabel = new Date(ts).toLocaleTimeString();

      // 1) actualizar datos del gráfico
      setTrafficData(prev => {
        const next = [
          ...prev,
          { timestamp: timeLabel, bytes, packets, source: ip_src, destination: ip_dst, protocol: protocolo }
        ];
        if (next.length > 20) next.shift();
        return next;
      });

      // 2) actualizar mapa/top
      const key = `${ip_src}:${ip_dst}:${protocolo}`;
      const map = new Map(topMapRef.current);
      const current = map.get(key) || { source: ip_src, destination: ip_dst, protocol: protocolo, bytes: 0, packets: 0, lastSeen: ts };
      current.bytes += bytes;
      current.packets += packets;
      current.lastSeen = ts;
      map.set(key, current);
      topMapRef.current = map;

      const topArr = Array.from(map.values())
        .sort((a, b) => (b.bytes || 0) - (a.bytes || 0))
        .slice(0, 5);

      setTopTraffic(topArr);

      // 3) actualizar estado de red
      const totalConnections = map.size;
      const activeConnections = topArr.length;
      //const totalBytes = topArr.reduce((acc, item) => acc + item.bytes, 0);
      //const totalPackets = topArr.reduce((acc, item) => acc + item.packets, 0);

      setNetworkStatus(() => {
        const lastPoints = topArr.reduce((acc, item) => acc + (item.bytes || 0), 0);
        const bandwidthUsage = formatBytes(lastPoints);
        return {
          totalConnections,
          activeConnections,
        bandwidthUsage,
        latency: `${Math.floor(Math.random() * 40) + 10} ms`,
        packetLoss: `${Math.floor(Math.random() * 2)}%`
        };
      });

    } catch (err) {
      console.error("[RealTimeTraffic] Error procesando mensaje WS:", err);
    }
  });

  return () => {
    cerrarTraffic();
  };
}, []);


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.timestamp}</p>
          <p className="text-cyan-400 text-xs">Bytes: {formatBytes(payload[0].value)}</p>
          <p className="text-green-400 text-xs">Packets: {payload[1]?.value || 0}</p>
          <p className="text-slate-400 text-xs mt-1">{payload[0].payload.protocol}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Conectando al monitor de tráfico en tiempo real...</p>
        </div>
    );
  }

  return (
    <>
        {/* Connection Status Alert */}
        <div className={`mb-6 ${isConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} border rounded-xl p-4 flex items-center space-x-3`}>
          {isConnected ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-yellow-400" />}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className={`font-medium ${isConnected ? 'text-green-300' : 'text-yellow-300'}`}>
              Estado:
            </span>
            <span className={isConnected ? 'text-green-400' : 'text-yellow-400'}>
              {isConnected ? 'Conectado en tiempo real' : 'Modo demostración / desconectado'}
            </span>
          </div>
        </div>

        {/* Network Status Cards */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Estado de la Red</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{networkStatus.totalConnections}</div>
              <div className="text-xs text-slate-400">Conexiones Totales</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{networkStatus.activeConnections}</div>
              <div className="text-xs text-slate-400">Conexiones Activas</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{networkStatus.bandwidthUsage}</div>
              <div className="text-xs text-slate-400">Ancho de Banda</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{networkStatus.latency}</div>
              <div className="text-xs text-slate-400">Latencia</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{networkStatus.packetLoss}</div>
              <div className="text-xs text-slate-400">Pérdida Paquetes</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{trafficData.length}</div>
              <div className="text-xs text-slate-400">Puntos Capturados</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Chart */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span>Gráfico de Tráfico</span>
                </h2>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-medium">
                  Actualización WebSocket
                </span>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: '#94a3b8', fontSize: '14px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bytes" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Bytes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="packets" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Paquetes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Traffic */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span>Top 5 Flujos</span>
              </h2>
              
              <div className="space-y-3">
                {topTraffic.length === 0 ? (
                  <div className="text-center py-8">
                    <Network className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No hay flujos registrados aún</p>
                  </div>
                ) : (
                  topTraffic.map((item, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">#{i + 1}</span>
                          </div>
                          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 font-mono">
                            {item.protocol}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{formatBytes(item.bytes)}</div>
                          <div className="text-xs text-slate-500">{item.packets} pkts</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-cyan-400 font-mono truncate">{item.source}</span>
                        <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <span className="text-blue-400 font-mono truncate">{item.destination}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-full px-6 py-3 flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Recibiendo datos en tiempo real</span>
            <span className="text-xs text-slate-600 font-mono">{trafficData.length > 0 ? trafficData[trafficData.length - 1]?.timestamp : '--:--:--'}</span>
          </div>
        </div>

    </>
  );
};


export default RealTimeTraffic;
