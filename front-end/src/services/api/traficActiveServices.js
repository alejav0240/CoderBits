import { isAxiosError } from "axios";
import api from "../../utils/axios.js"; 

export async function postActiveTraffic() {
    try {
        const response = await api.post("conexiones/activar_monitoreo/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener tráfico activo:", error);
        throw error;
    }
}