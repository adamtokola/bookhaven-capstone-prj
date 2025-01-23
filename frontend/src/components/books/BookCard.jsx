import React from 'react';
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Rating, 
    Box 
  } from '@mui/material';
  import { Link } from 'react-router-dom';
  
  export const BookCard = ({ book }) => {
    // Convert rating to number or default to 0
    const rating = Number(book.rating) || 0;

    return (
      <Card 
        component={Link} 
        to={`/books/${book.id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={book.cover_image_url || '/default-book-cover.jpg'}
          alt={book.title}
          sx={{ objectFit: 'contain', p: 1 }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {book.author?.name || 'Unknown Author'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {book.publication_year || 'Year N/A'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Rating 
              value={rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };