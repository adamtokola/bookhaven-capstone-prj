import { Box, Container, Typography, Button, Grid, Paper, TextField, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { BookSearch } from '../components/search/BookSearch';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to BookHaven
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Your digital sanctuary for book discovery and collection management.
          Browse our extensive library, create your reading lists, and join a
          community of book lovers.
        </Typography>

        {/* Search Section */}
        <Box 
          sx={{ 
            mt: 4, 
            mb: 6,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <BookSearch />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            {!user ? (
              <>
                <Grid item>
                  <Button variant="contained" onClick={() => navigate('/register')}>
                    Get Started
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item>
                <Button variant="contained" onClick={() => navigate('/books')}>
                  Browse Books
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Discover
              </Typography>
              <Typography>
                Explore our vast collection of books across various genres and authors.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Collect
              </Typography>
              <Typography>
                Create and manage your personal library with reading lists and favorites.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Connect
              </Typography>
              <Typography>
                Join discussions, share reviews, and connect with fellow book enthusiasts.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}; 