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

export const toggleMitigation = async ({ id, activo }) => {
  const action = activo ? "desactivar" : "activar";
  const { data } = await api.post(`/mitigaciones/${id}/${action}/`);
  return { data, id, action };
};