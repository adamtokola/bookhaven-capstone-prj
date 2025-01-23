import axios from 'axios';

const API_URL = 'http://localhost:5001';

const bookService = {
  fetchBooks: async ({ page = 1, genre = '', sortBy = 'title', order = 'asc' }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (genre && genre !== 'All') params.append('genre', genre);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      const response = await axios.get(`${API_URL}/books`, { params });
      return response.data;
    } catch (error) {
      console.error('Error in fetchBooks:', error);
      throw error;
    }
  },

  fetchBookById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in fetchBookById:', error);
      throw error;
    }
  },

  searchBooks: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error in searchBooks:', error);
      throw error;
    }
  }
};

export default bookService;

