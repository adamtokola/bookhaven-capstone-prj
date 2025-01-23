import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { BooksPage } from '../../pages/BooksPage';
import bookService from '../../services/bookService';

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock console.error to suppress expected error messages in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('Failed to fetch books:')) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock the book service
vi.mock('../../services/bookService', () => ({
  bookService: {
    getBooks: vi.fn()
  }
}));

const mockBooks = {
  books: [
    {
      id: 1,
      title: 'Test Book 1',
      author_name: 'Test Author 1',
      publication_year: 2021,
      rating: 4.5,
      cover_image_url: 'test-image-1.jpg',
      genre: 'Fiction'
    },
    {
      id: 2,
      title: 'Test Book 2',
      author_name: 'Test Author 2',
      publication_year: 2022,
      rating: 4.0,
      cover_image_url: 'test-image-2.jpg',
      genre: 'Non-Fiction'
    }
  ],
  totalPages: 2
};

describe('BooksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bookService.getBooks.mockResolvedValue(mockBooks);
  });

  const renderBooksPage = async () => {
    let result;
    await act(async () => {
      result = render(
        <BrowserRouter>
          <BooksPage />
        </BrowserRouter>
      );
    });
    return result;
  };

  test('renders loading state initially', async () => {
    // Delay the mock response to ensure we see the loading state
    bookService.getBooks.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockBooks), 100))
    );

    render(
      <BrowserRouter>
        <BooksPage />
      </BrowserRouter>
    );

    // Look for the CircularProgress component
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders books after loading', async () => {
    await renderBooksPage();
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
  });

  test('handles genre filter change', async () => {
    await renderBooksPage();

    await act(async () => {
      const genreSelect = screen.getByLabelText('Genre');
      fireEvent.mouseDown(genreSelect);
    });

    await act(async () => {
      const fictionOption = screen.getByText('Fiction');
      fireEvent.click(fictionOption);
    });

    expect(bookService.getBooks).toHaveBeenCalledWith(
      expect.objectContaining({ genre: 'Fiction' })
    );
  });

  test('handles sort change', async () => {
    await renderBooksPage();

    await act(async () => {
      const sortSelect = screen.getByLabelText('Sort By');
      fireEvent.mouseDown(sortSelect);
    });

    await act(async () => {
      const ratingOption = screen.getByText('Rating');
      fireEvent.click(ratingOption);
    });

    expect(bookService.getBooks).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'rating' })
    );
  });

  test('switches between grid and list views', async () => {
    await renderBooksPage();

    await act(async () => {
      const listViewButton = screen.getByLabelText('List view');
      fireEvent.click(listViewButton);
    });

    expect(screen.getByTestId('books-grid')).toHaveClass('list');

    await act(async () => {
      const gridViewButton = screen.getByLabelText('Grid view');
      fireEvent.click(gridViewButton);
    });

    expect(screen.getByTestId('books-grid')).toHaveClass('grid');
  });

  test('handles error state', async () => {
    bookService.getBooks.mockRejectedValue(new Error('Failed to fetch'));
    
    await renderBooksPage();
    
    expect(screen.getByText('Error loading books')).toBeInTheDocument();
  });

  test('handles pagination', async () => {
    await renderBooksPage();

    await act(async () => {
      const nextPageButton = screen.getByLabelText('Go to page 2');
      fireEvent.click(nextPageButton);
    });

    expect(bookService.getBooks).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  test('handles empty results', async () => {
    bookService.getBooks.mockResolvedValue({ books: [], totalPages: 0 });
    await renderBooksPage();
    
    expect(screen.getByText('No books found matching your criteria')).toBeInTheDocument();
  });
});