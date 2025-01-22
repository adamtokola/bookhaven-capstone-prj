import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Skeleton,
  Alert,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Bookmark as BookmarkIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BookshelfView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    readStatus: '',
    rating: '',
    year: '',
  });
  const [sortOption, setSortOption] = useState('title_asc');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState('all');
  const [shelves, setShelves] = useState([]);
  const [newShelfDialog, setNewShelfDialog] = useState({
    open: false,
    name: '',
    description: '',
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookMenuAnchor, setBookMenuAnchor] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchShelves();
  }, [selectedShelf]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/bookshelves/${selectedShelf}/books`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchShelves = async () => {
    try {
      const response = await fetch('http://localhost:5001/bookshelves', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch shelves');
      
      const data = await response.json();
      setShelves(data);
    } catch (err) {
      console.error('Failed to fetch shelves:', err);
    }
  };

  const handleCreateShelf = async () => {
    try {
      const response = await fetch('http://localhost:5001/bookshelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newShelfDialog.name,
          description: newShelfDialog.description,
        }),
      });

      if (!response.ok) throw new Error('Failed to create shelf');

      await fetchShelves();
      setNewShelfDialog({ open: false, name: '', description: '' });
    } catch (err) {
      setError('Failed to create shelf');
    }
  };

  const handleMoveBook = async (bookId, targetShelfId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/bookshelves/${targetShelfId}/books/${bookId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to move book');

      await fetchBooks();
      setBookMenuAnchor(null);
    } catch (err) {
      setError('Failed to move book');
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/bookshelves/${selectedShelf}/books/${bookId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to remove book');

      setBooks(books.filter(book => book.id !== bookId));
      setBookMenuAnchor(null);
    } catch (err) {
      setError('Failed to remove book');
    }
  };

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !filters.genre || book.genre === filters.genre;
      const matchesLanguage = !filters.language || book.language === filters.language;
      const matchesStatus = !filters.readStatus || book.readStatus === filters.readStatus;
      const matchesRating = !filters.rating || book.rating >= parseInt(filters.rating);
      const matchesYear = !filters.year || book.publishedYear === parseInt(filters.year);
      
      return matchesSearch && matchesGenre && matchesLanguage && 
             matchesStatus && matchesRating && matchesYear;
    })
    .sort((a, b) => {
      const [field, direction] = sortOption.split('_');
      const modifier = direction === 'asc' ? 1 : -1;
      
      switch (field) {
        case 'title':
          return modifier * a.title.localeCompare(b.title);
        case 'author':
          return modifier * a.author.localeCompare(b.author);
        case 'rating':
          return modifier * (b.rating - a.rating);
        case 'date':
          return modifier * (new Date(b.addedDate) - new Date(a.addedDate));
        default:
          return 0;
      }
    });

  const renderBookCard = (book) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: viewMode === 'grid' ? 'column' : 'row',
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={book.coverImage}
        alt={book.title}
        sx={{
          height: viewMode === 'grid' ? 200 : 150,
          width: viewMode === 'grid' ? '100%' : 100,
          objectFit: 'cover',
        }}
        onClick={() => navigate(`/books/${book.id}`)}
      />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            {book.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              setSelectedBook(book);
              setBookMenuAnchor(e.currentTarget);
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {book.author}
        </Typography>
        {book.genre && (
          <Chip
            label={book.genre}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<FilterListIcon />}
                onClick={() => setDrawerOpen(true)}
              >
                Filters
              </Button>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={selectedShelf}
                  onChange={(e) => setSelectedShelf(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Books</MenuItem>
                  {shelves.map(shelf => (
                    <MenuItem key={shelf.id} value={shelf.id}>
                      {shelf.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setNewShelfDialog({ ...newShelfDialog, open: true })}
              >
                New Shelf
              </Button>
              <Tooltip title="Change view">
                <IconButton onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map(book => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              lg={viewMode === 'grid' ? 3 : 12}
              key={book.id}
            >
              {renderBookCard(book)}
            </Grid>
          ))}
        </Grid>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Filter controls */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {/* Add genre options */}
            </Select>
          </FormControl>
          {/* Add more filter controls */}
        </Box>
      </Drawer>

      <Menu
        anchorEl={bookMenuAnchor}
        open={Boolean(bookMenuAnchor)}
        onClose={() => setBookMenuAnchor(null)}
      >
        <MenuItem onClick={() => navigate(`/books/${selectedBook?.id}`)}>
          View Details
        </MenuItem>
        <MenuItem>
          <FormControl fullWidth>
            <Select
              value=""
              onChange={(e) => handleMoveBook(selectedBook?.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Move to shelf...
              </MenuItem>
              {shelves.map(shelf => (
                <MenuItem key={shelf.id} value={shelf.id}>
                  {shelf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem
          onClick={() => handleRemoveBook(selectedBook?.id)}
          sx={{ color: 'error.main' }}
        >
          Remove from shelf
        </MenuItem>
      </Menu>

      <Dialog
        open={newShelfDialog.open}
        onClose={() => setNewShelfDialog({ ...newShelfDialog, open: false })}
      >
        <DialogTitle>Create New Shelf</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shelf Name"
            fullWidth
            value={newShelfDialog.name}
            onChange={(e) => setNewShelfDialog({ ...newShelfDialog, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newShelfDialog.description}
            onChange={(e) => setNewShelfDialog({ ...newShelfDialog, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewShelfDialog({ ...newShelfDialog, open: false })}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateShelf}
            variant="contained"
            disabled={!newShelfDialog.name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BookshelfView; 