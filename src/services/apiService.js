// src/services/apiService.js
import axios from 'axios';
import VueCookies from 'vue-cookies';
import backendRoute from '@/components/BackendRouter/BackendRouter';

// Creamos una instancia de Axios con la URL base DINÁMICA
const apiClient = axios.create({
  baseURL: backendRoute.data
});

// Interceptor: adjunta JWT (si existe) en cada request
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

// Exportación de métodos (se mantiene igual) + ✅ extras para Excel
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
  },

  // ✅ Descarga de archivos (Excel/PDF/etc.)
  getBlob(endpoint) {
    return apiClient.get(endpoint, { responseType: 'blob' });
  },

  // ✅ Subida de archivos (multipart/form-data)
  postForm(endpoint, formData) {
    return apiClient.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};