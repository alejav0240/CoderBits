import React, { useEffect, useState, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from "recharts";

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


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '280px' }}>
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
          <div style={{
            width: 12, height: 12, borderRadius: 12,
            marginRight: 8,
            backgroundColor: isConnected ? '#198754' : '#ffc107'
          }} />
          <div>
            <strong>Estado:</strong> {isConnected ? 'Conectado en tiempo real' : 'Modo demostración / desconectado'}
          </div>
        </div>
      </div>

      {/* Estado red */}
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-header"><h5 className="mb-0">Estado de la Red</h5></div>
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
                  <small className="text-muted">Puntos</small>
                </div>
              </div>
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
                <CartesianGrid strokeDasharray="3 100" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bytes" stroke="#0d6efd" strokeWidth={2} dot={false} name="Bytes" />
                <Line type="monotone" dataKey="packets" stroke="#198754" strokeWidth={1.5} dot={false} name="Paquetes" />
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
              {topTraffic.length === 0 && <div className="text-muted">No hay flujos aún</div>}
              {topTraffic.map((item, i) => (
                <div key={i} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-primary">#{i + 1}</strong>
                      <div className="small text-muted">{item.protocol}</div>
                    </div>

                    <div className="text-center">
                      <div className="fw-bold">{item.source}</div>
                      <small className="text-muted">→</small>
                      <div className="small text-muted">{item.destination}</div>
                    </div>

                    <div className="text-end">
                      <div className="fw-bold text-success">{formatBytes(item.bytes)}</div>
                      <small className="text-muted">{item.packets} pkts</small>
                    </div>
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
