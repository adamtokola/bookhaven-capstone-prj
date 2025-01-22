import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Popper,
  Grow,
  ClickAwayListener,
  Button,
  Divider,
  Typography,
  Rating,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TravelExplore as AdvancedSearchIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

function SearchBar({ variant = 'standard', fullWidth = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const anchorRef = useRef(null);
  
  // Advanced search filters
  const [filters, setFilters] = useState({
    genre: '',
    rating: [0, 5],
    yearRange: [1900, new Date().getFullYear()],
    sortBy: 'relevance',
    availability: 'all',
  });

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);

    // Initialize from URL params
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
    }
  }, []);

  const debouncedFetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/search/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    }
  }, 300);

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    // Add to search history
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(item => item !== searchQuery)
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Build search URL with filters
    const searchParams = new URLSearchParams();
    searchParams.set('q', searchQuery);
    
    if (filters.genre) searchParams.set('genre', filters.genre);
    if (filters.rating[0] > 0) searchParams.set('minRating', filters.rating[0]);
    if (filters.rating[1] < 5) searchParams.set('maxRating', filters.rating[1]);
    searchParams.set('yearFrom', filters.yearRange[0]);
    searchParams.set('yearTo', filters.yearRange[1]);
    if (filters.sortBy !== 'relevance') searchParams.set('sort', filters.sortBy);
    if (filters.availability !== 'all') searchParams.set('availability', filters.availability);

    // Navigate to search results
    navigate(`/search?${searchParams.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'book') {
      navigate(`/books/${suggestion.id}`);
    } else if (suggestion.type === 'author') {
      navigate(`/authors/${suggestion.id}`);
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        variant={variant}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedFetchSuggestions(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder="Search books, authors, genres..."
        ref={anchorRef}
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <IconButton size="small" onClick={() => setQuery('')}>
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton 
                size="small" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                color={showAdvanced ? 'primary' : 'default'}
              >
                {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />

      <Collapse in={showAdvanced}>
        <Paper sx={{ mt: 1, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Advanced Search
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={filters.genre}
              label="Genre"
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            >
              <MenuItem value="">All Genres</MenuItem>
              <MenuItem value="fiction">Fiction</MenuItem>
              <MenuItem value="non-fiction">Non-Fiction</MenuItem>
              {/* Add more genres */}
            </Select>
          </FormControl>

          <Typography variant="body2" gutterBottom>
            Rating Range
          </Typography>
          <Rating
            value={filters.rating[1]}
            onChange={(e, newValue) => {
              setFilters({ 
                ...filters, 
                rating: [filters.rating[0], newValue || 5]
              });
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" gutterBottom>
            Publication Year
          </Typography>
          <Slider
            value={filters.yearRange}
            onChange={(e, newValue) => {
              setFilters({ ...filters, yearRange: newValue });
            }}
            min={1900}
            max={new Date().getFullYear()}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Availability</InputLabel>
            <Select
              value={filters.availability}
              label="Availability"
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            >
              <MenuItem value="all">All Books</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="ebook">E-Book</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            fullWidth
            onClick={() => handleSearch()}
          >
            Search with Filters
          </Button>
        </Paper>
      </Collapse>

      <Popper
        open={showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        style={{ width: anchorRef.current?.offsetWidth }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                <List>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={`${suggestion.type}-${suggestion.id || index}`}
                      button
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <ListItemIcon>
                        {suggestion.type === 'book' ? (
                          <BookmarkIcon />
                        ) : suggestion.type === 'author' ? (
                          <PersonIcon />
                        ) : (
                          <SearchIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion.text}
                        secondary={suggestion.type}
                      />
                      {suggestion.type === 'book' && (
                        <Rating value={suggestion.rating} readOnly size="small" />
                      )}
                    </ListItem>
                  ))}

                  {searchHistory.length > 0 && suggestions.length === 0 && (
                    <>
                      <ListItem>
                        <ListItemText 
                          primary="Recent Searches"
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {searchHistory.map((item, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleSuggestionClick({ text: item })}
                        >
                          <ListItemIcon>
                            <HistoryIcon />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </>
                  )}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

export default SearchBar; 