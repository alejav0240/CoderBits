import { CONFIG } from '../config/config.js';

/**
 * Servicio para realizar peticiones a la API
 */
class ApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/';
  }

  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {Object} params - Parámetros de la consulta (opcional)
   * @returns {Promise} - Promesa con la respuesta
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${CONFIG.API_URL}/${endpoint}`);
    
    // Añadir parámetros a la URL si existen
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Realiza una petición POST a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${CONFIG.API_URL}/${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Realiza una petición PUT a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${CONFIG.API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Realiza una petición DELETE a la API
   * @param {string} endpoint - Endpoint de la API (sin la URL base)
   * @returns {Promise} - Promesa con la respuesta
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${CONFIG.API_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include'
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Obtiene los headers para las peticiones
   * @returns {Object} - Headers
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Añadir token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  /**
   * Maneja la respuesta de la API
   * @param {Response} response - Respuesta de fetch
   * @returns {Promise} - Promesa con los datos o error
   */
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzar un error
      const error = {
        status: response.status,
        message: data.message || 'Error en la petición',
        data
      };
      
      return Promise.reject(error);
    }
    
    return data;
  }
  
  /**
   * Maneja los errores de la API
   * @param {Error} error - Error
   * @returns {Promise} - Promesa rechazada con el error
   */
  handleError(error) {
    console.error('API Error:', error);
    return Promise.reject({
      status: 500,
      message: 'Error de conexión con el servidor',
      error
    });
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();