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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwOTgyNTg4LCJpYXQiOjE3NjA5ODA3ODgsImp0aSI6ImZmZDc4YmUyMDk5OTQ4N2E5YjlkYjJiNTY2MTk5NGFkIiwidXNlcl9pZCI6MSwidXN1YXJpbyI6IndpbGwiLCJyb2wiOiJBZG1pbmlzdHJhZG9yIGRlIHJlZCJ9._AFwP4amwx0yYm6LboYPZwb3YO_rZOOLm5jzg91zHRM";

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;