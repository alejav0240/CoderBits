import apiService from './api.js';

/**
 * Servicio para gestionar las operaciones relacionadas con el tráfico y conexiones
 */
class TrafficService {
  /**
   * Obtiene la lista de conexiones
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con la lista de conexiones
   */
  async getConnections(params = {}) {
    return apiService.get('conexiones/', params);
  }

  /**
   * Obtiene una conexión específica por su ID
   * @param {string|number} id - ID de la conexión
   * @returns {Promise} - Promesa con los datos de la conexión
   */
  async getConnectionById(id) {
    return apiService.get(`conexiones/${id}/`);
  }

  /**
   * Obtiene estadísticas de tráfico
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con las estadísticas
   */
  async getTrafficStatistics(params = {}) {
    return apiService.get('conexiones/statistics/', params);
  }

  /**
   * Inicia el monitoreo de tráfico
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async startMonitoring() {
    return apiService.post('conexiones/start-monitoring/');
  }

  /**
   * Detiene el monitoreo de tráfico
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async stopMonitoring() {
    return apiService.post('conexiones/stop-monitoring/');
  }

  /**
   * Obtiene el estado actual del monitoreo
   * @returns {Promise} - Promesa con el estado del monitoreo
   */
  async getMonitoringStatus() {
    return apiService.get('conexiones/monitoring-status/');
  }
}

// Exportar una instancia del servicio
const trafficService = new TrafficService();
export default trafficService;