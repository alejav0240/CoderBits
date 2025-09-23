import { authService } from '../../../features/auth/api/authService';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3001/api';
let socket = null;

const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const trafficService = {
    // Conexión WebSocket para tiempo real
    connectWebSocket(onMessage) {
        if (!socket) {
            socket = io(API_URL, {
                auth: {
                    token: authService.getToken()
                }
            });

            socket.on('trafficUpdate', onMessage);
            socket.on('connect', () => console.log('Conectado al servidor de tráfico'));
            socket.on('disconnect', () => console.log('Desconectado del servidor de tráfico'));
        }
        return socket;
    },

    disconnectWebSocket() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    async getTopTraffic(limit = 10) {
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