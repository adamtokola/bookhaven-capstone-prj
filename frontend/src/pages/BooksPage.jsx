import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { ViewModule, ViewList } from '@mui/icons-material';
import bookService from '../services/bookService';
import { BookCard } from '../components/books/BookCard';
import { BookListItem } from '../components/books/BookListItem';

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    sortBy: 'title',
    order: 'asc'
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.fetchBooks({
        page: page,
        ...filters
      });
      setBooks(response.books || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      setError('Error loading books');
      console.error('Failed to fetch books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [page, filters]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography ml={2}>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">Books</Typography>
        
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              label="Genre"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Classic">Classic</MenuItem>
              <MenuItem value="Science Fiction">Science Fiction</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Non-fiction">Non-fiction</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
              <MenuItem value="Mystery">Mystery</MenuItem>
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Historical Fiction">Historical Fiction</MenuItem>
              <MenuItem value="Young Adult">Young Adult</MenuItem>
              <MenuItem value="Contemporary">Contemporary</MenuItem>
              <MenuItem value="Literary Fiction">Literary Fiction</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              label="Sort By"
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="Grid view">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box 
        data-testid="books-grid"
        className={viewMode}
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: viewMode === 'grid' 
            ? { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }
            : '1fr',
        }}
      >
        {Array.isArray(books) && books.map(book => (
          viewMode === 'grid' ? (
            <BookCard key={book.id} book={book} />
          ) : (
            <BookListItem key={book.id} book={book} />
          )
        ))}
      </Box>

      {Array.isArray(books) && books.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No books found matching your criteria
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}; 