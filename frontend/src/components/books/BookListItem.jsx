import { 
  Paper, 
  Typography, 
  Rating, 
  Box 
} from '@mui/material';
import { Link } from 'react-router-dom';

export const BookListItem = ({ book }) => {
  return (
    <Paper
      component={Link}
      to={`/books/${book.id}`}
      sx={{
        display: 'flex',
        p: 2,
        gap: 3,
        textDecoration: 'none',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateX(4px)'
        }
      }}
    >
      <img
        src={book.cover_image_url || '/default-book-cover.jpg'}
        alt={book.title}
        style={{
          width: 100,
          height: 150,
          objectFit: 'cover',
          borderRadius: 4
        }}
      />
      <Box>
        <Typography variant="h6" component="h2">
          {book.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          by {book.author_name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={book.rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({book.rating})
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Published: {book.publication_year}
        </Typography>
      </Box>
    </Paper>
  );
};