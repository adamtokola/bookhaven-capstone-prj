import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          py: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          align="center"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem' },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Discover Your Next Favorite Book
        </Typography>

        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            color: 'text.secondary',
            mb: 4,
          }}
        >
          Explore ratings and reviews of timeless classics.
        </Typography>

        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            width: '100%',
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search books by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ m: 1 }}
          >
            Search
          </Button>
        </Paper>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default Home;
