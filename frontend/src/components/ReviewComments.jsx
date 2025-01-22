import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Menu,
  MenuItem,
  Alert,
  Tooltip,
  Badge,
  Popper,
  Paper,
  ClickAwayListener,
  Grid,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useAuth } from '../context/AuthContext';

function ReviewComments({ reviewId, initialComments = [], onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [anchorElEmoji, setAnchorElEmoji] = useState(null);
  
  const reactions = ['👍', '👎', '❤️', '😄', '😮', '😢', '��'];

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5001/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded(comment);
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5001/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const updatedComment = await response.json();
      setComments(comments.map(c => 
        c.id === commentId ? updatedComment : c
      ));
      setEditMode(null);
    } catch (err) {
      setError('Failed to update comment');
    } finally {
      setLoading(false);
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

      setComments(comments.filter(c => c.id !== commentId));
      setAnchorEl(null);
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleMenuOpen = (event, comment) => {
    setSelectedComment(comment);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const startEdit = (comment) => {
    setEditMode(comment.id);
    setEditContent(comment.content);
    handleMenuClose();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5001/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (!response.ok) throw new Error('Failed to post reply');

      const reply = await response.json();
      setComments(comments.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      ));
      setReplyContent('');
      setReplyTo(null);
    } catch (err) {
      setError('Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (commentId, reaction) => {
    try {
      const response = await fetch(`http://localhost:5001/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reaction }),
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      const updatedComment = await response.json();
      setComments(comments.map(c => 
        c.id === commentId ? updatedComment : c
      ));
    } catch (err) {
      setError('Failed to add reaction');
    }
  };

  const renderComment = (comment, isReply = false) => (
    <Box key={comment.id}>
      <ListItem
        alignItems="flex-start"
        sx={{ pl: isReply ? 8 : 2 }}
        secondaryAction={
          user?.id === comment.user.id && (
            <IconButton edge="end" onClick={(e) => handleMenuOpen(e, comment)}>
              <MoreVertIcon />
            </IconButton>
          )
        }
      >
        <ListItemAvatar>
          <Avatar src={comment.user.avatar}>
            {comment.user.username[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="span" variant="subtitle2">
                {comment.user.username}
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary">
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>
          }
          secondary={
            <>
              {editMode === comment.id ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    size="small"
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" onClick={() => handleEditComment(comment.id)}>
                      Save
                    </Button>
                    <Button size="small" onClick={() => setEditMode(null)} sx={{ ml: 1 }}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {comment.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => setReplyTo(comment.id)}
                    >
                      Reply
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorElEmoji(e.currentTarget)}
                    >
                      <InsertEmoticonIcon fontSize="small" />
                    </IconButton>

                    {comment.reactions?.map((reaction, index) => (
                      <Tooltip key={index} title={`${reaction.count} ${reaction.emoji}`}>
                        <Badge badgeContent={reaction.count} color="primary">
                          <Typography>{reaction.emoji}</Typography>
                        </Badge>
                      </Tooltip>
                    ))}
                  </Box>

                  {replyTo === comment.id && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleReply(comment.id)}
                        >
                          Reply
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setReplyTo(null)}
                          sx={{ ml: 1 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </>
          }
        />
      </ListItem>

      {comment.replies?.map(reply => renderComment(reply, true))}
      
      <Divider variant="inset" component="li" />
    </Box>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        startIcon={<CommentIcon />}
        onClick={() => setShowComments(!showComments)}
        sx={{ mb: 2 }}
      >
        {comments.length} Comments
      </Button>

      <Collapse in={showComments}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newComment.trim()}
            sx={{ mt: 1 }}
          >
            Post Comment
          </Button>
        </Box>

        <List>
          {comments.map(comment => renderComment(comment))}
        </List>

        <Popper
          open={Boolean(anchorElEmoji)}
          anchorEl={anchorElEmoji}
          onClose={() => setAnchorElEmoji(null)}
          placement="top"
        >
          <ClickAwayListener onClickAway={() => setAnchorElEmoji(null)}>
            <Paper sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {reactions.map(emoji => (
                  <Grid item key={emoji}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleReaction(selectedComment?.id, emoji);
                        setAnchorElEmoji(null);
                      }}
                    >
                      <Typography>{emoji}</Typography>
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </ClickAwayListener>
        </Popper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => startEdit(selectedComment)}>
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteComment(selectedComment?.id)}>
            Delete
          </MenuItem>
        </Menu>
      </Collapse>
    </Box>
  );
}

export default ReviewComments; 