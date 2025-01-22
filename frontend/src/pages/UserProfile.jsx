import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  RateReview as ReviewIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const [userResponse, reviewsResponse, bookmarksResponse, historyResponse] = 
        await Promise.all([
          fetch(`http://localhost:5001/users/${username}`),
          fetch(`http://localhost:5001/users/${username}/reviews`),
          fetch(`http://localhost:5001/users/${username}/bookmarks`),
          fetch(`http://localhost:5001/users/${username}/reading-history`)
        ]);

      if (!userResponse.ok) throw new Error('User not found');

      const userData = await userResponse.ok ? await userResponse.json() : null;
      const reviewsData = await reviewsResponse.ok ? await reviewsResponse.json() : [];
      const bookmarksData = await bookmarksResponse.ok ? await bookmarksResponse.json() : [];
      const historyData = await historyResponse.ok ? await historyResponse.json() : [];

      setUser(userData);
      setReviews(reviewsData);
      setBookmarks(bookmarksData);
      setReadingHistory(historyData);
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/${username}/report`, {
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
    } catch (err) {
      setError('Failed to submit report');
    }
  };

  const handleMessage = async () => {
    try {
      const response = await fetch(`http://localhost:5001/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          recipientId: user.id,
          content: message,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setMessageDialogOpen(false);
      setMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleBlock = async () => {
    if (!window.confirm('Are you sure you want to block this user?')) return;

    try {
      const response = await fetch(`http://localhost:5001/users/${username}/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to block user');
      
      navigate(-1);
    } catch (err) {
      setError('Failed to block user');
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return <Alert severity="error">User not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={user.avatar}
                alt={user.username}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              {currentUser && currentUser.id !== user.id && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<MessageIcon />}
                    variant="contained"
                    onClick={() => setMessageDialogOpen(true)}
                  >
                    Message
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => setReportDialogOpen(true)}
                    title="Report user"
                  >
                    <FlagIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={handleBlock}
                    title="Block user"
                  >
                    <BlockIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography>
                {user.bio || 'No bio provided'}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{reviews.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Reviews</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{bookmarks.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Bookmarks</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{readingHistory.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Books Read</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<ReviewIcon />} label="Reviews" />
          <Tab icon={<BookmarkIcon />} label="Bookmarks" />
          <Tab icon={<TimelineIcon />} label="Reading History" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {currentTab === 0 && (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <img
                      src={review.book.coverImage}
                      alt={review.book.title}
                      style={{ width: 100, height: 150, objectFit: 'cover' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component={RouterLink}
                        to={`/books/${review.book.id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {review.book.title}
                      </Typography>
                      <Rating value={review.rating} readOnly sx={{ my: 1 }} />
                      <Typography>{review.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {currentTab === 1 && (
          <Grid container spacing={2}>
            {bookmarks.map((bookmark) => (
              <Grid item xs={12} sm={6} md={4} key={bookmark.id}>
                <Card
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                  }}
                  onClick={() => navigate(`/books/${bookmark.book.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={bookmark.book.coverImage}
                    alt={bookmark.book.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {bookmark.book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {bookmark.book.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {currentTab === 2 && (
          <List>
            {readingHistory.map((item) => (
              <ListItem
                key={item.id}
                component={Paper}
                sx={{ mb: 2 }}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={item.book.coverImage}
                    alt={item.book.title}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <RouterLink
                      to={`/books/${item.book.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.book.title}
                    </RouterLink>
                  }
                  secondary={`Read on ${new Date(item.completedAt).toLocaleDateString()}`}
                />
                {item.status === 'completed' && (
                  <Chip
                    label="Completed"
                    color="success"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report User</DialogTitle>
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

      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Message to {user.username}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleMessage}
            variant="contained"
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function ProfileSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={150} height={150} />
              <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width={150} height={24} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={32} width="40%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={100} />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[...Array(3)].map((_, i) => (
                <Grid item xs={4} key={i}>
                  <Skeleton variant="rectangular" height={80} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default UserProfile; 