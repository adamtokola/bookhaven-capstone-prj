import api from './api';

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
  },
};

export default authService;
