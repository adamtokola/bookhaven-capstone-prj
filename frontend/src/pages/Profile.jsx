import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Card,
  CardContent,
  Rating,
  IconButton,
  Alert,
  Grid,
  Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import NotificationSettings from '../components/NotificationSettings';

function Profile() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    fetchUserContent();
  }, [currentTab]);

  const fetchUserContent = async () => {
    try {
      if (currentTab === 0) {
        const response = await fetch(`http://localhost:5001/users/reviews`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } else {
        const response = await fetch(`http://localhost:5001/users/comments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5001/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setOpenDialog(false);
      // Update local user data
      const updatedUser = await response.json();
      // You might want to update the auth context here
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`http://localhost:5001/books/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete review');

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:5001/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profileData.avatar}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{profileData.username}</Typography>
            <Typography color="text.secondary">{profileData.email}</Typography>
            {profileData.bio && (
              <Typography sx={{ mt: 1 }}>{profileData.bio}</Typography>
            )}
          </Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ ml: 'auto' }}
          >
            Edit Profile
          </Button>
        </Box>

        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="My Reviews" />
          <Tab label="My Comments" />
          <Tab label="Settings" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {currentTab === 0 ? (
            <Grid container spacing={3}>
              {reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Link
                          component={RouterLink}
                          to={`/books/${review.book.id}`}
                          color="inherit"
                          underline="hover"
                        >
                          <Typography variant="h6">{review.book.title}</Typography>
                        </Link>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Rating value={review.rating} readOnly />
                      <Typography sx={{ mt: 1 }}>{review.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {reviews.length === 0 && (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                  You haven't written any reviews yet.
                </Typography>
              )}
            </Grid>
          ) : currentTab === 1 ? (
            <Grid container spacing={3}>
              {comments.map((comment) => (
                <Grid item xs={12} key={comment.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          On review for{' '}
                          <Link
                            component={RouterLink}
                            to={`/books/${comment.review.book.id}`}
                          >
                            {comment.review.book.title}
                          </Link>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography>{comment.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {comments.length === 0 && (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                  You haven't made any comments yet.
                </Typography>
              )}
            </Grid>
          ) : (
            <Box sx={{ mt: 3 }}>
              <NotificationSettings />
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Avatar URL"
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;