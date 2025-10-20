import api from "../../utils/axios.js"; 

export async function getAtacks(params) {
    try {
        const response = await api.get("ataques/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener ataques:", error);
        throw error;
    }
}   