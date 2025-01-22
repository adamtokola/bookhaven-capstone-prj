import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Skeleton,
  Alert,
  Paper,
  Button,
  Pagination,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SortingOptions from '../components/SortingOptions';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    setError('');

    try {
      const queryString = searchParams.toString();
      const response = await fetch(
        `http://localhost:5001/search?${queryString}&page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch search results');
      
      const data = await response.json();
      
      // Apply client-side sorting if needed
      let sortedResults = [...data.results];
      const sortParam = searchParams.get('sort');
      
      if (sortParam) {
        sortedResults = sortResults(sortedResults, sortParam);
      }
      
      setResults(sortedResults);
      setTotalResults(data.total);
    } catch (err) {
      setError('Failed to load search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (results, sortParam) => {
    const [sortField, direction] = sortParam.split('_');
    const isDesc = direction === 'desc';

    const compare = (a, b, isAsc = true) => {
      if (isAsc) {
        return a < b ? -1 : a > b ? 1 : 0;
      } else {
        return a > b ? -1 : a < b ? 1 : 0;
      }
    };

    switch (sortField) {
      case 'title':
        return [...results].sort((a, b) => 
          compare(a.title.toLowerCase(), b.title.toLowerCase(), !isDesc)
        );
      case 'author':
        return [...results].sort((a, b) => 
          compare(a.author.toLowerCase(), b.author.toLowerCase(), !isDesc)
        );
      case 'rating':
        return [...results].sort((a, b) => 
          compare(a.averageRating, b.averageRating, !isDesc)
        );
      case 'date':
        return [...results].sort((a, b) => 
          compare(new Date(a.publishedDate), new Date(b.publishedDate), !isDesc)
        );
      case 'popularity':
        return [...results].sort((a, b) => 
          compare(a.ratingsCount, b.ratingsCount, !isDesc)
        );
      case 'reviews':
        return [...results].sort((a, b) => 
          compare(a.reviewsCount, b.reviewsCount, !isDesc)
        );
      default:
        return results; // Keep server-side relevance sorting
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', value);
    navigate(`/search?${newSearchParams.toString()}`);
  };

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderNoResults = () => (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        No results found
      </Typography>
      <Typography color="text.secondary" paragraph>
        Try adjusting your search or filters to find what you're looking for.
      </Typography>
      <Button 
        variant="contained"
        onClick={() => navigate('/books')}
      >
        Browse All Books
      </Button>
    </Paper>
  );

  const renderSearchStats = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Search Results
      </Typography>
      <Typography color="text.secondary">
        Found {totalResults} results for "{searchParams.get('q')}"
      </Typography>
      {isMobile && (
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{ mt: 1 }}
        >
          Filters
        </Button>
      )}
    </Box>
  );

  const renderActiveFilters = () => {
    const filters = [];
    
    if (searchParams.get('genre')) {
      filters.push({
        label: `Genre: ${searchParams.get('genre')}`,
        param: 'genre'
      });
    }
    if (searchParams.get('minRating')) {
      filters.push({
        label: `Min Rating: ${searchParams.get('minRating')}★`,
        param: 'minRating'
      });
    }
    // Add more filters as needed

    if (filters.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.map((filter) => (
            <Chip
              key={filter.param}
              label={filter.label}
              onDelete={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete(filter.param);
                navigate(`/search?${newSearchParams.toString()}`);
              }}
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <SearchBar fullWidth variant="outlined" />
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {renderSearchStats()}
          {renderActiveFilters()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {totalResults} results found
              </Typography>
            </Box>
            <SortingOptions />
          </Box>

          <Grid container spacing={3}>
            {!isMobile && (
              <Grid item xs={12} md={3} lg={2}>
                <Paper sx={{ p: 2, position: 'sticky', top: 84 }}>
                  <Typography variant="h6" gutterBottom>
                    Filters
                  </Typography>
                  {/* SearchBar component handles filters */}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                renderSkeleton()
              ) : results.length === 0 ? (
                renderNoResults()
              ) : (
                <>
                  <Grid container spacing={3}>
                    {results.map((book) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: 6,
                            },
                          }}
                          onClick={() => navigate(`/books/${book.id}`)}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={book.coverImage || 'https://via.placeholder.com/200x300'}
                            alt={book.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" noWrap>
                              {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {book.author}
                            </Typography>
                            <Box sx={{ mt: 1, mb: 1 }}>
                              <Rating value={book.averageRating} readOnly size="small" />
                              <Typography variant="caption" color="text.secondary">
                                ({book.ratingsCount})
                              </Typography>
                            </Box>
                            {book.genre && (
                              <Chip
                                label={book.genre}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* SearchBar component handles filters */}
        </Box>
      </Drawer>
    </Container>
  );
}

export default SearchResults; 