// src/services/apiService.js
import axios from 'axios';
import VueCookies from 'vue-cookies';
import backendRoute from '@/components/BackendRouter/BackendRouter'; // 1. Se importa la ruta

// Creamos una instancia de Axios con la URL base DINÁMICA
const apiClient = axios.create({
  baseURL: backendRoute.data // 2. Se usa la ruta importada
});

// El interceptor permanece exactamente igual
apiClient.interceptors.request.use(
  (config) => {
    const token = VueCookies.get('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// La exportación de métodos permanece igual
export default {
  get(endpoint) {
    return apiClient.get(endpoint);
  },
  post(endpoint, data) {
    return apiClient.post(endpoint, data);
  },
  put(endpoint, data) {
    return apiClient.put(endpoint, data);
  },
  delete(endpoint) {
    return apiClient.delete(endpoint);
  }
};