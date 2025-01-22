import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  LinearProgress,
  Menu,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Tooltip,
  Skeleton,
  DragIndicator,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Update as UpdateIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ReadingList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [books, setBooks] = useState({
    queue: [],
    reading: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progressDialog, setProgressDialog] = useState({
    open: false,
    bookId: null,
    progress: 0,
    notes: ''
  });
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    bookId: null,
    rating: 0,
    review: ''
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      const response = await fetch('http://localhost:5001/reading-list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch reading list');
      
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Failed to load reading list');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    try {
      // Create new book lists
      const newBooks = { ...books };
      const [movedBook] = newBooks[sourceList].splice(source.index, 1);
      newBooks[destList].splice(destination.index, 0, movedBook);
      setBooks(newBooks);

      // Update on server
      const response = await fetch(`http://localhost:5001/reading-list/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookId: movedBook.id,
          fromList: sourceList,
          toList: destList,
          newIndex: destination.index
        }),
      });

      if (!response.ok) throw new Error('Failed to update reading list');
      
      setSuccessMessage('Reading list updated');
    } catch (err) {
      setError('Failed to update reading list');
      fetchReadingList(); // Refresh list on error
    }
  };

  const handleProgressUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5001/reading-list/${progressDialog.bookId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          progress: progressDialog.progress,
          notes: progressDialog.notes
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');

      await fetchReadingList();
      setProgressDialog({ open: false, bookId: null, progress: 0, notes: '' });
      setSuccessMessage('Progress updated');
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/books/${reviewDialog.bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rating: reviewDialog.rating,
          content: reviewDialog.review
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setReviewDialog({ open: false, bookId: null, rating: 0, review: '' });
      setSuccessMessage('Review submitted');
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const handleRemoveBook = async (bookId, list) => {
    try {
      const response = await fetch(`http://localhost:5001/reading-list/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to remove book');

      setBooks({
        ...books,
        [list]: books[list].filter(book => book.id !== bookId)
      });
      setSuccessMessage('Book removed from reading list');
    } catch (err) {
      setError('Failed to remove book');
    }
  };

  const renderBookCard = (book, index, list) => (
    <Draggable key={book.id} draggableId={book.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{ 
            display: 'flex',
            mb: 2,
            position: 'relative',
            '&:hover': { boxShadow: 6 }
          }}
        >
          <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <DragIndicator />
          </Box>
          
          <CardMedia
            component="img"
            sx={{ width: 100 }}
            image={book.coverImage}
            alt={book.title}
            onClick={() => navigate(`/books/${book.id}`)}
            style={{ cursor: 'pointer' }}
          />
          
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6" noWrap>
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {book.author}
            </Typography>
            
            {list === 'reading' && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={book.progress || 0}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {book.progress}% completed
                </Typography>
              </Box>
            )}
            
            {list === 'completed' && book.rating && (
              <Box sx={{ mt: 1 }}>
                <Rating value={book.rating} readOnly size="small" />
              </Box>
            )}
          </CardContent>

          <Box sx={{ display: 'flex', alignItems: 'start', p: 1 }}>
            <IconButton
              onClick={(event) => {
                setMenuAnchor(event.currentTarget);
                setSelectedBook({ ...book, list });
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Card>
      )}
    </Draggable>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reading List
      </Typography>

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Queue (${books.queue.length})`} />
        <Tab label={`Reading (${books.reading.length})`} />
        <Tab label={`Completed (${books.completed.length})`} />
      </Tabs>

      {loading ? (
        <ReadingListSkeleton />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {['queue', 'reading', 'completed'].map((list, index) => (
              <Grid 
                item 
                xs={12} 
                key={list}
                sx={{ display: currentTab === index ? 'block' : 'none' }}
              >
                <Droppable droppableId={list}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: 100 }}
                    >
                      {books[list].map((book, index) => 
                        renderBookCard(book, index, list)
                      )}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedBook(null);
        }}
      >
        {selectedBook?.list === 'reading' && (
          <MenuItem
            onClick={() => {
              setProgressDialog({
                open: true,
                bookId: selectedBook.id,
                progress: selectedBook.progress || 0,
                notes: selectedBook.notes || ''
              });
              setMenuAnchor(null);
            }}
          >
            <UpdateIcon sx={{ mr: 1 }} /> Update Progress
          </MenuItem>
        )}
        
        {selectedBook?.list === 'completed' && !selectedBook?.rating && (
          <MenuItem
            onClick={() => {
              setReviewDialog({
                open: true,
                bookId: selectedBook.id,
                rating: 0,
                review: ''
              });
              setMenuAnchor(null);
            }}
          >
            <CheckCircleIcon sx={{ mr: 1 }} /> Add Review
          </MenuItem>
        )}
        
        <MenuItem
          onClick={() => {
            handleRemoveBook(selectedBook.id, selectedBook.list);
            setMenuAnchor(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Remove
        </MenuItem>
      </Menu>

      <Dialog
        open={progressDialog.open}
        onClose={() => setProgressDialog({ ...progressDialog, open: false })}
      >
        <DialogTitle>Update Reading Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Progress (%)</Typography>
            <TextField
              type="number"
              value={progressDialog.progress}
              onChange={(e) => setProgressDialog({
                ...progressDialog,
                progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              })}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
            <TextField
              multiline
              rows={4}
              label="Reading Notes"
              value={progressDialog.notes}
              onChange={(e) => setProgressDialog({
                ...progressDialog,
                notes: e.target.value
              })}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog({ ...progressDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleProgressUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ ...reviewDialog, open: false })}
      >
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={reviewDialog.rating}
              onChange={(event, newValue) => {
                setReviewDialog({ ...reviewDialog, rating: newValue });
              }}
            />
            <TextField
              multiline
              rows={4}
              label="Review"
              value={reviewDialog.review}
              onChange={(e) => setReviewDialog({
                ...reviewDialog,
                review: e.target.value
              })}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ ...reviewDialog, open: false })}>
            Cancel
          </Button>
          <Button 
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={!reviewDialog.rating || !reviewDialog.review.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

function ReadingListSkeleton() {
  return (
    <Box>
      {[...Array(3)].map((_, index) => (
        <Card key={index} sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="rectangular" width={100} height={150} />
          <CardContent sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Box sx={{ mt: 1 }}>
              <Skeleton variant="rectangular" height={10} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ReadingList; 