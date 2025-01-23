import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BookCard } from '../../components/books/BookCard';

const mockBook = {
  id: 1,
  title: 'Test Book',
  author_name: 'Test Author',
  publication_year: 2023,
  rating: 4.5,
  cover_image_url: 'test-image.jpg'
};

describe('BookCard', () => {
  const renderBookCard = (book = mockBook) => {
    return render(
      <BrowserRouter>
        <BookCard book={book} />
      </BrowserRouter>
    );
  };

  test('renders book information correctly', () => {
    renderBookCard();

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  test('renders default cover image when no image URL provided', () => {
    const bookWithoutImage = { ...mockBook, cover_image_url: null };
    renderBookCard(bookWithoutImage);

    const coverImage = screen.getByRole('img', { name: 'Test Book' });
    expect(coverImage).toHaveAttribute('src', '/default-book-cover.jpg');
  });

  test('links to correct book detail page', () => {
    renderBookCard();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/1');
  });

  test('renders rating component', () => {
    renderBookCard();

    const rating = screen.getByRole('img', { name: '4.5 Stars' });
    expect(rating).toBeInTheDocument();
  });
}); 