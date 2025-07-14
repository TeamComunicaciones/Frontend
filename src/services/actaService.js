// src/services/actaService.js
import apiService from './apiService';
import backendRoute from '@/components/BackendRouter/BackendRouter';

const API_URL = backendRoute.data + 'actas-entrega/';

export default {
  getActas(token) {
    return apiService.get(API_URL, token);
  },

  getActa(id, token) {
    return apiService.get(`${API_URL}${id}/`, token);
  },

  createActa(data, token) {
    return apiService.post(API_URL, data, token);
  },

  updateActa(id, data, token) {
    return apiService.put(`${API_URL}${id}/`, data, token);
  },

  deleteActa(id, token) {
    return apiService.delete(`${API_URL}${id}/`, token);
  }
};
