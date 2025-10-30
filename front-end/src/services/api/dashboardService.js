import { isAxiosError } from "axios";
import api from "../../utils/axios.js"; 

export async function getDashboardStats() {
    try {
        const response = await api.get(`dashboard/stats/`);
        return response.data;
    } catch (error) {
        console.error("Error en getDashboardStats:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener el resumen del dashboard.");
        }
        throw new Error("Error inesperado al intentar obtener el resumen del dashboard.");
    }
}

export async function getAttackStats(params = {}) {
    try {
        const response = await api.get(`dashboard/attack-stats/`, { params });
        return response.data;
    } catch (error) {
        console.error("Error en getAttackStats:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener las estadísticas de ataques.");
        }
        throw new Error("Error inesperado al intentar obtener las estadísticas de ataques.");
    }
}

export async function getTrafficStats(params = {}) {
    try {
        const response = await api.get(`dashboard/traffic-stats/`, { params });
        return response.data;
    } catch (error) {
        console.error("Error en getTrafficStats:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener las estadísticas de tráfico.");
        }
        throw new Error("Error inesperado al intentar obtener las estadísticas de tráfico.");
    }
}

export async function getRecentEvents(limit = 10) {
    try {
        const response = await api.get(`dashboard/recent-events/`, { params: { limit } });
        return response.data;
    } catch (error) {
        console.error("Error en getRecentEvents:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener los eventos recientes.");
        }
        throw new Error("Error inesperado al intentar obtener los eventos recientes.");
    }
}

export async function getAnalytics(params = {}) {
    try {
        const response = await api.get(`dashboard/analytics/`, { params });
        return response.data;
    } catch (error) {
        console.error("Error en getAnalytics:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener las estadísticas de análisis.");
        }
        throw new Error("Error inesperado al intentar obtener las estadísticas de análisis.");
    }
}