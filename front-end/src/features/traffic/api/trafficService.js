import { authService } from '../../../features/auth/api/authService';

const API_URL = 'http://localhost:3001/api';
const USE_MOCK_DATA = true;

// Mock WebSocket corregido
class MockWebSocket {
    constructor() {
        this.callbacks = {};
        this.connected = false;
        this.intervalId = null;
    }

    connect(onMessage) {
        this.connected = true;
        this.callbacks['trafficUpdate'] = onMessage;
        console.log('Mock WebSocket conectado');
        
        // Simular datos en tiempo real cada 3 segundos
        this.intervalId = setInterval(() => {
            if (this.connected && this.callbacks['trafficUpdate']) {
                this.callbacks['trafficUpdate']({
                    bytes: Math.floor(Math.random() * 1000000) + 500000,
                    packets: Math.floor(Math.random() * 10000) + 1000,
                    connections: Math.floor(Math.random() * 200) + 50,
                    timestamp: new Date().toISOString()
                });
            }
        }, 3000);

        // Simular evento de conexión después de un breve delay
        setTimeout(() => {
            if (this.callbacks['connect']) {
                this.callbacks['connect']();
            }
        }, 100);
    }

    on(event, callback) {
        this.callbacks[event] = callback;
        return this;
    }

    disconnect() {
        this.connected = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('Mock WebSocket desconectado');
    }
}

let mockWebSocket = null;

export const trafficService = {
    connectWebSocket(onMessage) {
        if (USE_MOCK_DATA) {
            mockWebSocket = new MockWebSocket();
            mockWebSocket.connect(onMessage);
            return mockWebSocket;
        }

        // Código real de WebSocket aquí...
        console.log('WebSocket real no implementado aún');
        return null;
    },

    disconnectWebSocket() {
        if (USE_MOCK_DATA && mockWebSocket) {
            mockWebSocket.disconnect();
            mockWebSocket = null;
        }
    },

    async getTopTraffic(limit = 10) {
        if (USE_MOCK_DATA) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 200));
            
            return [
                { source: '192.168.1.100', destination: '8.8.8.8', bytes: 104857600, protocol: 'TCP' },
                { source: '10.0.0.50', destination: '1.1.1.1', bytes: 52428800, protocol: 'UDP' },
                { source: '203.0.113.45', destination: 'web-server-01', bytes: 20971520, protocol: 'TCP' },
                { source: '198.51.100.23', destination: 'db-server-01', bytes: 15728640, protocol: 'TCP' },
                { source: '192.168.1.150', destination: 'api-server-01', bytes: 12582912, protocol: 'TCP' }
            ].slice(0, limit);
        }

        try {
            const response = await fetch(
                `${API_URL}/traffic/top?limit=${limit}`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener tráfico');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getTrafficHistory(timeRange = '1h') {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const data = [];
            const now = new Date();
            let points = 60; // 60 puntos para 1 hora
            
            if (timeRange === '24h') points = 24;
            if (timeRange === '7d') points = 7;
            
            for (let i = points; i >= 0; i--) {
                const timestamp = new Date(now.getTime() - i * (timeRange === '7d' ? 24 * 3600000 : timeRange === '24h' ? 3600000 : 60000));
                data.push({
                    timestamp: timeRange === '7d' ? timestamp.toLocaleDateString() : timestamp.toLocaleTimeString(),
                    bytes: Math.floor(Math.random() * 1000000) + 500000,
                    packets: Math.floor(Math.random() * 10000) + 1000,
                    connections: Math.floor(Math.random() * 200) + 50
                });
            }
            return data;
        }

        try {
            const response = await fetch(
                `${API_URL}/traffic/history?range=${timeRange}`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener historial');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getNetworkStatus() {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            return {
                totalConnections: Math.floor(Math.random() * 500) + 100,
                activeConnections: Math.floor(Math.random() * 200) + 50,
                bandwidthUsage: `${Math.floor(Math.random() * 100)}%`,
                latency: `${Math.floor(Math.random() * 100) + 10}ms`,
                packetLoss: `${(Math.random() * 2).toFixed(2)}%`
            };
        }

        try {
            const response = await fetch(
                `${API_URL}/traffic/network-status`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener estado de red');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};