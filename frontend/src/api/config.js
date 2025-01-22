const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/update`,
    READING_LIST: `${API_BASE_URL}/users/reading-list`,
    BOOKSHELF: `${API_BASE_URL}/users/bookshelf`,
  },
  BOOKS: {
    BASE: `${API_BASE_URL}/books`,
    SEARCH: `${API_BASE_URL}/books/search`,
    CATEGORIES: `${API_BASE_URL}/books/categories`,
  },
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    SETTINGS: `${API_BASE_URL}/notifications/settings`,
  }
};

export const createApiClient = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const handleResponse = async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };

  return {
    get: async (url) => {
      const response = await fetch(url, { headers });
      return handleResponse(response);
    },
    post: async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    put: async (url, data) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    delete: async (url) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      return handleResponse(response);
    },
  };
}; 