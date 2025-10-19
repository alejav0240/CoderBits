import apiService from './api';

/**
 * Servicio para manejar la autenticación
 */
class AuthService {
  /**
   * Inicia sesión con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} - Promesa con los datos del usuario
   */
  async login(username, password) {
    try {
      const response = await apiService.post('api/token/', { username, password });
      
      if (response.access) {
        localStorage.setItem('authToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        
        // Obtener información del usuario
        const userInfo = await this.getUserInfo();
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene información del usuario actual
   * @returns {Promise} - Promesa con los datos del usuario
   */
  async getUserInfo() {
    try {
      return await apiService.get('api/personales/me/');
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      throw error;
    }
  }
  
  /**
   * Cierra la sesión del usuario
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
  
  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - True si está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
  
  /**
   * Obtiene el usuario actual
   * @returns {Object|null} - Datos del usuario o null
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  /**
   * Obtiene el token de autenticación
   * @returns {string|null} - Token o null
   */
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Exportar una instancia única del servicio
export const authService = new AuthService();