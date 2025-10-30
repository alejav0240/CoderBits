import { isAxiosError } from "axios";
import api from "../../utils/axios.js"; 

export async function getUser(id) {
    try {
        const response = await api.get(`personales/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error en getUser:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener el usuario.");
        }
        throw new Error("Error inesperado al intentar obtener el usuario.");
    }
}

export async function getUsers(filters = {}) {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`personales/?${params}`);
        return response.data;
    } catch (error) {
        console.error("Error en getUsers:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener los usuarios.");
        }
        throw new Error("Error inesperado al intentar obtener los usuarios.");
    }
}

export async function createUser(userData) {
    try {
        const response = await api.post(`personales/`, userData);
        return response.data;
    } catch (error) {
        console.error("Error en createUser:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al crear el usuario.");
        }
        throw new Error("Error inesperado al intentar crear el usuario.");
    }
}

export async function updateUser(id, userData) {
    try {
        // Omitir campos que no deben enviarse al backend: 'usuario' y 'correo'
        const { usuario, correo, ...payload } = userData || {};
        userData = payload;
        const response = await api.patch(`personales/${id}/`, userData);
        return response.data;
    } catch (error) {
        console.error("Error en updateUser:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al actualizar el usuario.");
        }
        throw new Error("Error inesperado al intentar actualizar el usuario.");
    }
}

export async function deleteUser(id) {
    try {
        const response = await api.delete(`personales/${id} /`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteUser:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al eliminar el usuario.");
        }
        throw new Error("Error inesperado al intentar eliminar el usuario.");
    }
}

export async function getRoles() {
    try {
        const response = await api.get(`roles/`);
        return response.data;
    } catch (error) {
        console.error("Error en getRoles:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            throw new Error(message || "Error al obtener los roles.");
        }
        throw new Error("Error inesperado al intentar obtener los roles.");
    }
}