'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';

const socket = io('http://localhost:3001'); // Ensure this is your correct server URL

const Comments = () => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Fetch initial comments
    axios.get('http://localhost:3001/api/comments')
      .then((res) => setComments(res.data))
      .catch((error) => console.error('Error fetching comments:', error));

    // Listen for new comments from the server
    socket.on('newComment', (newComment) => {
      setComments((prevComments) => [newComment, ...prevComments]);
    });

    return () => socket.off('newComment');
  }, []);

  const handleLogin = () => {
    if (!username) return;

    axios.post('http://localhost:3001/api/login', { username })
      .then((res) => {
        setSessionId(res.data.sessionId);
      })
      .catch((error) => console.error('Error logging in:', error));
  };

  const handleCommentSubmit = () => {
    if (!comment) return;

    // Post the new comment
    axios.post('http://localhost:3001/api/comments', {
      username,
      comment,
    })
    .then((res) => {
      setComment(''); // Clear the comment input
      // Automatically add the new comment to the list
      setComments((prevComments) => [res.data, ...prevComments]);
    })
    .catch((error) => console.error('Error posting comment:', error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, bgcolor: 'black', color: 'white' }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent', border: '2px solid #f54278' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#f54278' }}>
          Real-Time Comments
        </Typography>

        {!sessionId ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Log in to join the conversation
            </Typography>
            <TextField
              label="Enter Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2, bgcolor: 'white' }} // Set background to white for input
              InputLabelProps={{
                style: { color: '#f5426c' } // Set label color to #f5426c
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ py: 1 }}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Post a new comment
            </Typography>
            <TextField
              label="Enter Comment"
              variant="outlined"
              fullWidth
              margin="normal"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2, bgcolor: 'white' }} // Set background to white for input
              InputLabelProps={{
                style: { color: '#f5426c' } // Set label color to #f5426c
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCommentSubmit}
              sx={{ py: 1 }}
            >
              Post Comment
            </Button>
          </>
        )}

        <Divider sx={{ my: 3, bgcolor: '#f54278' }} />

        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#f54278' }}>
            Comments
          </Typography>
          <List sx={{ maxHeight: '400px', overflowY: 'auto', bgcolor: 'transparent' }}>
            {comments.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ mb: 1 }}>
                <Paper elevation={2} sx={{ p: 2, width: '100%', bgcolor: 'black', border: '1px solid #f54278' }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold" color="white">
                        {comment.username}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="white"
                          sx={{ display: 'inline', mr: 1 }}
                        >
                          {new Date(comment.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" color="white" sx={{ mt: 1 }}>
                          {comment.comment}
                        </Typography>
                      </>
                    }
                  />
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default Comments;
