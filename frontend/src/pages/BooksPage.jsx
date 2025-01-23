import { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  TextField,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Slider,
  Paper
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

// Mock data with more fields
const MOCK_BOOKS = [
  { 
    id: 1, 
    title: 'The Great Gatsby', 
    author: 'F. Scott Fitzgerald',
    cover: 'https://example.com/gatsby.jpg',
    genre: ['Classic', 'Literary Fiction'],
    rating: 4.5,
    year: 1925,
    language: 'English'
  },
  // Add more mock books...
];

// Filter options
const GENRES = ['Classic', 'Literary Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German'];
const YEARS = [1900, 2024];

export const BooksPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('title');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [yearRange, setYearRange] = useState(YEARS);
  const [page, setPage] = useState(1);
  const searchQuery = searchParams.get('search') || '';

  // Enhanced filtering logic
  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenres = selectedGenres.length === 0 || 
                         selectedGenres.some(genre => book.genre.includes(genre));
    
    const matchesLanguages = selectedLanguages.length === 0 ||
                            selectedLanguages.includes(book.language);
    
    const matchesRating = book.rating >= ratingRange[0] && book.rating <= ratingRange[1];
    
    const matchesYear = book.year >= yearRange[0] && book.year <= yearRange[1];

    return matchesSearch && matchesGenres && matchesLanguages && matchesRating && matchesYear;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
          </Grid>
          
          {/* Genre Filter */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Genres</InputLabel>
              <Select
                multiple
                value={selectedGenres}
                onChange={(e) => setSelectedGenres(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {GENRES.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Language Filter */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Languages</InputLabel>
              <Select
                multiple
                value={selectedLanguages}
                onChange={(e) => setSelectedLanguages(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {LANGUAGES.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Rating Range */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Rating Range</Typography>
            <Slider
              value={ratingRange}
              onChange={(_, newValue) => setRatingRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
            />
          </Grid>

          {/* Year Range */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Publication Year</Typography>
            <Slider
              value={yearRange}
              onChange={(_, newValue) => setYearRange(newValue)}
              valueLabelDisplay="auto"
              min={YEARS[0]}
              max={YEARS[1]}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Sort Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {searchQuery ? `Search Results: ${searchQuery}` : 'All Books'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              fullWidth
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="year">Publication Year</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Rest of the component (Books Grid and Pagination) stays the same */}
    </Container>
  );
}; 