import { authService } from '../../../features/auth/api/authService';

const API_URL = 'http://localhost:3001/api';

let attacksCache = {
    data: null,
    timestamp: null,
    ttl: 1 * 60 * 1000 // 1 minuto
};

const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const attacksService = {
    async getAttacks(page = 1, limit = 10, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            });

            const response = await fetch(
                `${API_URL}/attacks?${queryParams}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) throw new Error('Error al obtener ataques');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getAttackStats(timeRange = '24h') {
        try {
            const response = await fetch(
                `${API_URL}/attacks/stats?range=${timeRange}`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener estadísticas');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getRealTimeAttacks() {
        try {
            const response = await fetch(
                `${API_URL}/attacks/realtime`,
                { headers: getAuthHeaders() }
            );
            if (!response.ok) throw new Error('Error al obtener ataques en tiempo real');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};