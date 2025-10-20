import { isAxiosError } from "axios";
import api from "../../utils/axios.js"; 

export async function getMitigaciones(params) {
    try {
        const response = await api.get("mitigaciones/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener mitigaciones:", error);
        throw error;
    }
}