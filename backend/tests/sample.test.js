const { Book } = require('../app/models');
const { createTestBook } = require('./helpers');

describe('Sample Test', () => {
  test('Can create a book', async () => {
    const book = await createTestBook();
    const foundBook = await Book.findByPk(book.id);
    
    expect(foundBook).toBeDefined();
    expect(foundBook.title).toBe('Test Book');
  });
}); 