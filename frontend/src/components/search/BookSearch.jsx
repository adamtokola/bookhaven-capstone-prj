import { useState } from 'react';
import { Autocomplete, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Temporary mock data until API is ready
const MOCK_BOOKS = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: '1984', author: 'George Orwell' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' },
];

export const BookSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // Using mock data for now - replace with API call later
      const filteredBooks = MOCK_BOOKS.filter(book => 
        book.title.toLowerCase().includes(value.toLowerCase()) ||
        book.author.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filteredBooks);
    } catch (error) {
      console.error('Search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600 }}>
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        inputValue={searchQuery}
        onInputChange={(_, newValue) => handleSearch(newValue)}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue === 'object') {
            navigate(`/books/${newValue.id}`);
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.title || '';
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for books..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={option.id} {...otherProps}>
              <div>
                <div>{option.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  by {option.author}
                </div>
              </div>
            </li>
          );
        }}
      />
    </form>
  );
}; 