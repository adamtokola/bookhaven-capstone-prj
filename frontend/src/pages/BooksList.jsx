import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Rating,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActionArea,
  Pagination,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [genre, setGenre] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const genres = ["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Romance", "Biography"];
  const ITEMS_PER_PAGE = 12;

  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSearchParams(prev => {
          prev.set("page", (currentPage + 1).toString());
          return prev;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        let url = `http://localhost:5001/books?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (genre && genre !== "all") {
          url += `&genre=${encodeURIComponent(genre)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch books");
        
        const data = await response.json();
        if (useInfiniteScroll) {
          setBooks(prev => [...prev, ...data.books]);
        } else {
          setBooks(data.books);
        }
        setHasMore(data.books.length === ITEMS_PER_PAGE);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      } catch (err) {
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, genre, currentPage, useInfiniteScroll]);

  const handlePageChange = (event, value) => {
    setSearchParams(prev => {
      prev.set("page", value);
      return prev;
    });
    window.scrollTo(0, 0);
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Books
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search books..."
              defaultValue={searchQuery}
              onChange={(e) => {
                const search = e.target.value;
                if (search) {
                  navigate(`/books?search=${encodeURIComponent(search)}`);
                } else {
                  navigate("/books");
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="all">All Genres</MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={useInfiniteScroll}
              onChange={(e) => setUseInfiniteScroll(e.target.checked)}
            />
          }
          label="Enable infinite scroll"
          sx={{ mt: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {useInfiniteScroll ? (
              <Grid container spacing={3}>
                {books.map((book, index) => (
                  <Grid 
                    item 
                    key={book.id} 
                    xs={12} sm={6} md={4} lg={3}
                    ref={index === books.length - 1 ? lastBookElementRef : null}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <CardActionArea onClick={() => handleBookClick(book.id)}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={book.coverImage || "https://via.placeholder.com/200x300?text=No+Cover"}
                          alt={book.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="h2" noWrap>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {book.author}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating 
                              value={book.averageRating} 
                              precision={0.5} 
                              readOnly 
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({book.averageRating?.toFixed(1) || 'N/A'})
                            </Typography>
                          </Box>
                          <Chip 
                            label={book.genre} 
                            size="small" 
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
                
                {books.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Typography variant="h6" align="center" color="text.secondary">
                      No books found
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <>
                <Grid container spacing={3}>
                  {books.map((book) => (
                    <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                        }}
                      >
                        <CardActionArea onClick={() => handleBookClick(book.id)}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={book.coverImage || "https://via.placeholder.com/200x300?text=No+Cover"}
                            alt={book.title}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h6" component="h2" noWrap>
                              {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {book.author}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating 
                                value={book.averageRating} 
                                precision={0.5} 
                                readOnly 
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({book.averageRating?.toFixed(1) || 'N/A'})
                              </Typography>
                            </Box>
                            <Chip 
                              label={book.genre} 
                              size="small" 
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                  
                  {books.length === 0 && !loading && (
                    <Grid item xs={12}>
                      <Typography variant="h6" align="center" color="text.secondary">
                        No books found
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {books.length > 0 && (
                  <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    justifyContent: 'center',
                    '& .MuiPagination-ul': {
                      flexWrap: isMobile ? 'nowrap' : 'wrap',
                    }
                  }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default BooksList;
