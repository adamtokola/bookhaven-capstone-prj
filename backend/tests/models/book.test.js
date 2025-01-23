const { Book } = require('../../app/models');
const { createTestBook } = require('../helpers');

describe('Book Model', () => {
  test('Can create a book', async () => {
    const book = await createTestBook();
    expect(book.title).toBe('Test Book');
    expect(book.author).toBe('Test Author');
    expect(book.genre).toBe('Test Genre');
    expect(book.averageRating).toBe(4.0);
  });

  test('Cannot create book without required fields', async () => {
    await expect(Book.create({})).rejects.toThrow();
  });

  test('Can update book rating', async () => {
    const book = await createTestBook();
    book.averageRating = 4.5;
    await book.save();
    
    const updatedBook = await Book.findByPk(book.id);
    expect(updatedBook.averageRating).toBe(4.5);
  });

  test('Can delete book', async () => {
    const book = await createTestBook();
    await book.destroy();
    
    const deletedBook = await Book.findByPk(book.id);
    expect(deletedBook).toBeNull();
  });
}); 