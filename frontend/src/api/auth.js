import { API_ENDPOINTS, createApiClient } from './config';

class AuthService {
  constructor() {
    this.api = createApiClient();
  }

  setToken(token) {
    this.api = createApiClient(token);
  }

  async login(email, password) {
    try {
      const response = await this.api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(userData) {
    try {
      return await this.api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async forgotPassword(email) {
    try {
      return await this.api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      throw new Error('Failed to send reset email');
    }
  }

  async resetPassword(token, password) {
    try {
      return await this.api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password,
      });
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async verifyEmail(token) {
    try {
      return await this.api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    } catch (error) {
      throw new Error('Email verification failed');
    }
  }

  async logout() {
    try {
      await this.api.post(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem('token');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async refreshToken() {
    try {
      const response = await this.api.post(API_ENDPOINTS.AUTH.REFRESH);
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }
}

export default new AuthService();