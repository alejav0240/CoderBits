import apiService from './api.js';

/**
 * Servicio para gestionar las operaciones relacionadas con usuarios
 */
class UsersService {
  /**
   * Obtiene la lista de usuarios
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise} - Promesa con la lista de usuarios
   */
  async getUsers(params = {}) {
    return apiService.get('personales/', params);
  }

  /**
   * Obtiene un usuario específico por su ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise} - Promesa con los datos del usuario
   */
  async getUserById(id) {
    return apiService.get(`personales/${id}/`);
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async createUser(userData) {
    return apiService.post('personales/', userData);
  }

  /**
   * Actualiza un usuario existente
   * @param {string|number} id - ID del usuario
   * @param {Object} userData - Datos actualizados del usuario
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async updateUser(id, userData) {
    return apiService.put(`personales/${id}/`, userData);
  }

  /**
   * Elimina un usuario
   * @param {string|number} id - ID del usuario
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  async deleteUser(id) {
    return apiService.delete(`personales/${id}/`);
  }

  /**
   * Obtiene los roles disponibles
   * @returns {Promise} - Promesa con la lista de roles
   */
  async getRoles() {
    return apiService.get('roles/');
  }
}

// Exportar una instancia del servicio
const usersService = new UsersService();
export default usersService;