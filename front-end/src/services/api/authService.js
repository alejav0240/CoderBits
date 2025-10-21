import { isAxiosError } from "axios";
import api from "../../utils/axios.js"; 

export async function postLogin(credentials) {
    console.log("credentials recibidas en postLogin:", credentials);
    try {
        const response = await api.post("personales/login_personal/", credentials); 
        const { message, access, refresh } = response.data;
        console.log("Tokens recibidos:", { access, refresh });
        if (!access || !refresh) {
            throw new Error("No se recibieron tokens del servidor.");
        }
        console.log("Mensaje del servidor:", message);
        return { message, access, refresh };
    } catch (error) {
        console.error("Error en postLogin:", error);
        if (isAxiosError(error) && error.response) {
            const message = (error.response.data)?.error || error.response.data?.detail;
            
            throw new Error(message || "Error al iniciar sesión. Credenciales incorrectas o servidor no disponible.");
        }

        throw new Error("Error inesperado al intentar iniciar sesión.");
    }
}