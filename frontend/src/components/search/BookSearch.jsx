import { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';
import debounce from 'lodash/debounce';

export const BookSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const searchBooks = debounce(async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      const results = await bookService.searchBooks(query);
      // Filter out duplicates based on title
      const uniqueResults = results.reduce((acc, current) => {
        const x = acc.find(item => item.title === current.title);
        if (!x && current.cover_image_url) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setOptions(uniqueResults);
    } catch (error) {
      console.error('Search failed:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <Autocomplete
        id="book-search"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="No books found"
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          searchBooks(newInputValue);
        }}
        onChange={(event, value) => {
          if (value) {
            navigate(`/books/${value.id}`);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search books"
            variant="outlined"
            size="large"
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                padding: '16px 14px',
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.87)',
              },
              '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
                color: 'rgba(255, 255, 255, 0.54)',
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const uniqueKey = `${option.id}-${option.title}`;
          return (
            <li {...props} key={uniqueKey}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                {option.cover_image_url && (
                  <img
                    src={option.cover_image_url}
                    alt={option.title}
                    style={{ 
                      width: 40, 
                      height: 60, 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 500 }}>{option.title}</div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgba(0, 0, 0, 0.6)'
                  }}>
                    by {option.author_name} ({option.publication_year})
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgba(0, 0, 0, 0.6)'
                  }}>
                    Rating: {option.rating}/5
                  </div>
                </div>
              </div>
            </li>
          );
        }}
        sx={{
          width: '100%',
          '& .MuiAutocomplete-listbox': {
            maxHeight: '400px',
          }
        }}
      />
    </div>
  );
}; 