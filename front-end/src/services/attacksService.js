import apiService from './api.js';

/**
 * Servicio para gestionar las operaciones relacionadas con ataques
 */
class AttacksService {
  /**
   * Obtiene la lista de ataques
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con la lista de ataques
   */
  async getAttacks(params = {}) {
    return apiService.get('ataques/', params);
  }

  /**
   * Obtiene un ataque específico por su ID
   * @param {string|number} id - ID del ataque
   * @returns {Promise} - Promesa con los datos del ataque
   */
  async getAttackById(id) {
    return apiService.get(`ataques/${id}/`);
  }

  /**
   * Obtiene estadísticas de ataques
   * @returns {Promise} - Promesa con las estadísticas
   */
  async getAttackStatistics() {
    return apiService.get('ataques/statistics/');
  }

  /**
   * Marca un ataque como revisado
   * @param {string|number} id - ID del ataque
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async markAttackAsReviewed(id) {
    return apiService.put(`ataques/${id}/review/`, { reviewed: true });
  }
}

// Exportar una instancia del servicio
const attacksService = new AttacksService();
export default attacksService;