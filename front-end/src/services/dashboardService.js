import apiService from './api.js';

/**
 * Servicio para gestionar las operaciones relacionadas con el dashboard
 */
class DashboardService {
  /**
   * Obtiene los datos del resumen del dashboard
   * @returns {Promise} - Promesa con los datos del dashboard
   */
  async getDashboardSummary() {
    return apiService.get('dashboard/summary');
  }

  /**
   * Obtiene las estadísticas de ataques
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con las estadísticas
   */
  async getAttackStats(params = {}) {
    return apiService.get('dashboard/attack-stats', params);
  }

  /**
   * Obtiene las estadísticas de tráfico
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con las estadísticas
   */
  async getTrafficStats(params = {}) {
    return apiService.get('dashboard/traffic-stats', params);
  }

  /**
   * Obtiene los eventos recientes
   * @param {number} limit - Límite de eventos a obtener
   * @returns {Promise} - Promesa con los eventos recientes
   */
  async getRecentEvents(limit = 10) {
    return apiService.get('dashboard/recent-events', { limit });
  }
}

// Exportar una instancia del servicio
const dashboardService = new DashboardService();
export default dashboardService;