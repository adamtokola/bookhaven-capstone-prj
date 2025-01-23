import api from './api';

const bookService = {
  async searchBooks(query) {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  
  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  }
};

export default bookService;
