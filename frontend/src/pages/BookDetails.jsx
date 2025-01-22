import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  CardMedia,
  Paper,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReviewComments from '../components/ReviewComments';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/books/${id}`);
        if (!response.ok) throw new Error("Book not found");
        
        const data = await response.json();
        setBook(data);
        setReviews(data.reviews || []);
      } catch (err) {
        setError("Failed to load book details");
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/books/${id}/related`
        );
        if (!response.ok) throw new Error("Failed to fetch related books");
        
        const data = await response.json();
        setRelatedBooks(data);
      } catch (err) {
        console.error("Error fetching related books:", err);
      }
    };

    if (book) {
      fetchRelatedBooks();
    }
  }, [book]);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    }
  }, [user]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/bookmarks/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookmarked(response.ok);
    } catch (err) {
      console.error('Failed to check bookmark status:', err);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/users/bookmarks/${id}`, {
        method: bookmarked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to update bookmark');
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Failed to update bookmark:', err);
    }
  };

  const handleReviewSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5001/books/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setIsReviewDialogOpen(false);
      setReview({ rating: 0, comment: "" });
    } catch (err) {
      setError("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: `Check out ${book.title} by ${book.author}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage("Link copied to clipboard!");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleReviewAction = (review) => (event) => {
    setSelectedReview(review);
    setAnchorEl(event.currentTarget);
  };

  const handleEditReview = () => {
    setReview({
      rating: selectedReview.rating,
      comment: selectedReview.comment,
    });
    setIsReviewDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/books/${id}/reviews/${selectedReview.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter((r) => r.id !== selectedReview.id));
      setSnackbarMessage("Review deleted successfully");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Failed to delete review");
    }
    setAnchorEl(null);
  };

  const handleReport = async () => {
    try {
      const response = await fetch(`http://localhost:5001/books/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason: reportReason }),
      });

      if (!response.ok) throw new Error('Failed to submit report');
      
      setReportDialogOpen(false);
      setReportReason('');
      // Show success message
    } catch (err) {
      setError('Failed to submit report');
    }
  };

  if (loading) {
    return <BookDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/books")}
          sx={{ mt: 2 }}
        >
          Back to Books
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/books")}
        sx={{ mb: 4 }}
      >
        Back to Books
      </Button>

      {book && (
        <Grid container spacing={4}>
          {/* Book Info */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <img
                src={book.coverImage || "https://via.placeholder.com/300x450?text=No+Cover"}
                alt={book.title}
                style={{ width: "100%", borderRadius: 8, mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button
                  startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={handleBookmark}
                >
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button startIcon={<ShareIcon />} onClick={handleShare}>
                  Share
                </Button>
              </Box>
              {user && (
                <Button
                  startIcon={<FlagIcon />}
                  color="error"
                  fullWidth
                  onClick={() => setReportDialogOpen(true)}
                >
                  Report Issue
                </Button>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={book.averageRating || 0} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({book.ratingsCount} ratings)
              </Typography>
            </Box>

            {book.genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                sx={{ mr: 1, mb: 1 }}
                onClick={() => navigate(`/search?genre=${genre}`)}
              />
            ))}

            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                Write a Review
              </Button>
            </Box>
          </Grid>

          {/* Reviews Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Reviews
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {reviews.length === 0 ? (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review this book!
              </Typography>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ mr: 2 }}>{review.user.username[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {review.user.username}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      {user && user.id === review.user.id && (
                        <IconButton onClick={handleReviewAction(review)}>
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {review.comment}
                    </Typography>

                    <ReviewComments 
                      reviewId={review.id}
                      initialComments={review.comments}
                      onCommentAdded={(comment) => {
                        setReviews(reviews.map(r => 
                          r.id === review.id 
                            ? { ...r, comments: [...r.comments, comment] }
                            : r
                        ));
                      }}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        </Grid>
      )}

      {/* Review Dialog */}
      <Dialog
        open={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Rating
              value={review.rating}
              onChange={(event, newValue) => {
                setReview({ ...review, rating: newValue });
              }}
              size="large"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={isSubmitting || !review.rating || !review.comment}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleEditReview}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteReview}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {relatedBooks.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Books
          </Typography>
          <Grid container spacing={3}>
            {relatedBooks.map((relatedBook) => (
              <Grid item key={relatedBook.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => navigate(`/books/${relatedBook.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={relatedBook.coverImage || "https://via.placeholder.com/200x300"}
                    alt={relatedBook.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {relatedBook.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {relatedBook.author}
                    </Typography>
                    <Rating value={relatedBook.averageRating || 0} readOnly size="small" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Issue</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            label="Reason for reporting"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReport}
            variant="contained"
            color="error"
            disabled={!reportReason.trim()}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function BookDetailsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={400} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={36} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" height={40} width="80%" />
          <Skeleton variant="text" height={30} width="60%" />
          <Box sx={{ my: 2 }}>
            <Skeleton variant="text" width="40%" />
          </Box>
          <Box sx={{ mb: 2 }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={80}
                height={32}
                sx={{ mr: 1, display: 'inline-block' }}
              />
            ))}
          </Box>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="text" height={20} sx={{ mb: 1 }} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default BookDetails;
