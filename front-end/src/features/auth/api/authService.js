const API_URL = 'http://localhost:3001/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Si falla la conexión, lanzar error
      throw new Error('Error de conexión con el servidor');
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
};