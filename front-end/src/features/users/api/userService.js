import { authService } from '../../auth/api/authService';

const API_URL = 'http://localhost:3001/api';

// Cache simple
let usersCache = {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000
};

const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const userService = {
    async getUsers(page = 1, limit = 10) {
        try {
            const response = await fetch(
                `${API_URL}/users?page=${page}&limit=${limit}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) throw new Error('Error al obtener usuarios');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getUserById(id) {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener usuario');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async createUser(userData) {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Error al crear usuario');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Error al actualizar usuario');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async deleteUser(id) {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};