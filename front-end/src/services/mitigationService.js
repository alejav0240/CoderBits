import apiService from './api.js';

/**
 * Servicio para gestionar las operaciones relacionadas con mitigaciones
 */
class MitigationService {
  /**
   * Obtiene la lista de mitigaciones
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con la lista de mitigaciones
   */
  async getMitigations(params = {}) {
    return apiService.get('mitigaciones/', params);
  }

  /**
   * Obtiene una mitigación específica por su ID
   * @param {string|number} id - ID de la mitigación
   * @returns {Promise} - Promesa con los datos de la mitigación
   */
  async getMitigationById(id) {
    return apiService.get(`mitigaciones/${id}/`);
  }

  /**
   * Crea una nueva mitigación
   * @param {Object} mitigationData - Datos de la mitigación
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async createMitigation(mitigationData) {
    return apiService.post('mitigaciones/', mitigationData);
  }

  /**
   * Actualiza una mitigación existente
   * @param {string|number} id - ID de la mitigación
   * @param {Object} mitigationData - Datos actualizados de la mitigación
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async updateMitigation(id, mitigationData) {
    return apiService.put(`mitigaciones/${id}/`, mitigationData);
  }

  /**
   * Elimina una mitigación
   * @param {string|number} id - ID de la mitigación
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async deleteMitigation(id) {
    return apiService.delete(`mitigaciones/${id}/`);
  }

  /**
   * Aplica una mitigación específica
   * @param {string|number} id - ID de la mitigación
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async applyMitigation(id) {
    return apiService.post(`mitigaciones/${id}/apply/`);
  }
}

// Exportar una instancia del servicio
const mitigationService = new MitigationService();
export default mitigationService;