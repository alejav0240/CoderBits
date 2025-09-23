import { authService } from '../../../features/auth/api/authService';

const API_URL = 'http://localhost:3001/api';

let mitigationsCache = {
    data: null,
    timestamp: null,
    ttl: 2 * 60 * 1000 // 2 minutos
};

const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const mitigationService = {
    async getMitigations(page = 1, limit = 10, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            });

            const response = await fetch(
                `${API_URL}/mitigations?${queryParams}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) throw new Error('Error al obtener mitigaciones');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getMitigationById(id) {
        try {
            const response = await fetch(`${API_URL}/mitigations/${id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async createMitigation(mitigationData) {
        try {
            const response = await fetch(`${API_URL}/mitigations`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(mitigationData)
            });
            if (!response.ok) throw new Error('Error al crear mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async updateMitigation(id, mitigationData) {
        try {
            const response = await fetch(`${API_URL}/mitigations/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(mitigationData)
            });
            if (!response.ok) throw new Error('Error al actualizar mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async applyMitigation(mitigationId) {
        try {
            const response = await fetch(`${API_URL}/mitigations/${mitigationId}/apply`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al aplicar mitigación');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};