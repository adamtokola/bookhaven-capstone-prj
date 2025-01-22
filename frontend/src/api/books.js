import { API_ENDPOINTS, createApiClient } from './config';

class BookService {
  constructor() {
    this.api = createApiClient();
  }

  setToken(token) {
    this.api = createApiClient(token);
  }

  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.api.get(`${API_ENDPOINTS.BOOKS.LIST}?${queryString}`);
  }

  async getBookDetails(id) {
    return this.api.get(API_ENDPOINTS.BOOKS.DETAILS(id));
  }

  async searchBooks(query) {
    return this.api.get(`${API_ENDPOINTS.BOOKS.SEARCH}?q=${encodeURIComponent(query)}`);
  }

  async getCategories() {
    return this.api.get(API_ENDPOINTS.BOOKS.CATEGORIES);
  }

  async addToReadingList(bookId, status = 'want-to-read') {
    return this.api.post(API_ENDPOINTS.USERS.READING_LIST, { bookId, status });
  }

  async updateReadingStatus(bookId, status) {
    return this.api.put(API_ENDPOINTS.USERS.READING_LIST, { bookId, status });
  }

  async addReview(bookId, review) {
    return this.api.post(API_ENDPOINTS.REVIEWS.CREATE, { bookId, ...review });
  }
}

export default new BookService(); 