// services/api.ts
import axios from 'axios';

// Cambia esta IP a la IP de tu máquina si estás probando en un dispositivo
const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes agregar un interceptor para incluir el token en TODAS las peticiones
api.interceptors.request.use(async (config) => {
  // Aquí obtendrías el token de AsyncStorage o SecureStore
  // const token = await AsyncStorage.getItem('userToken');
  const token = "MY_DUMMY_TOKEN"; // Reemplaza con lógica real

  if (token) {
    config.headers.Authorization = `Token ${token}`; // O Bearer, según tu backend
  }
  return config;
});

export default api;