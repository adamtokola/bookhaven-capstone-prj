import { API_ENDPOINTS, createApiClient } from './config';

class UserService {
  constructor() {
    this.api = createApiClient();
  }

  setToken(token) {
    this.api = createApiClient(token);
  }

  async getProfile() {
    return this.api.get(API_ENDPOINTS.USERS.PROFILE);
  }

  async updateProfile(data) {
    return this.api.put(API_ENDPOINTS.USERS.UPDATE, data);
  }

  async getReadingList() {
    return this.api.get(API_ENDPOINTS.USERS.READING_LIST);
  }

  async updateReadingList(bookId, status) {
    return this.api.put(`${API_ENDPOINTS.USERS.READING_LIST}/${bookId}`, { status });
  }

  async getBookshelf() {
    return this.api.get(API_ENDPOINTS.USERS.BOOKSHELF);
  }

  async createBookshelf(data) {
    return this.api.post(API_ENDPOINTS.USERS.BOOKSHELF, data);
  }

  async updateBookshelf(id, data) {
    return this.api.put(`${API_ENDPOINTS.USERS.BOOKSHELF}/${id}`, data);
  }

  async deleteBookshelf(id) {
    return this.api.delete(`${API_ENDPOINTS.USERS.BOOKSHELF}/${id}`);
  }
}

export default new UserService(); 