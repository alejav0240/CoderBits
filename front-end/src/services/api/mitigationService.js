import api from "../../utils/axios.js";

export const getMitigaciones = async (filters = {}) => {
  console.log("Cargando mitigaciones con filtros service :", filters);
  try {
    const params = new URLSearchParams(filters).toString();
    const { data } = await api.get(`/mitigaciones/?${params}`);
    return data;
  } catch (error) {
    console.error("Error al obtener mitigaciones:", error);
    throw error;
  }
};

export const toggleMitigation = async ({ id, activo }) => {
    try {
      const action = activo ? "desactivar" : "activar";
      const { data } = await api.post(`/mitigaciones/${id}/${action}/`);
      return { data, id, action };
    } catch (error) {
      console.error("Error al cambiar estado de mitigación:", error);
      throw error;
    }
};

