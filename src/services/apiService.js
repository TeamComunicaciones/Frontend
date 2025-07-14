// src/services/apiService.js
import axios from 'axios';

const apiService = {
  get(url, token) {
    return axios.get(url, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  post(url, data, token) {
    return axios.post(url, data, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  put(url, data, token) {
    return axios.put(url, data, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  delete(url, token) {
    return axios.delete(url, {
      headers: { Authorization: `Token ${token}` }
    });
  }
};

export default apiService;
