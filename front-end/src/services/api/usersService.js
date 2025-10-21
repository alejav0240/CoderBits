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

export async function getUsers() {
    try {
        const response = await api.get(`personales/`);
        console.log("Respuesta de getUsers:", response.data);
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
        const response = await api.put(`personales/${id}/`, userData);
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
        const response = await api.delete(`personales/${id}/restaurar/`);
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