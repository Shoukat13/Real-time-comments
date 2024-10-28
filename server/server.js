const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors());
const db = mysql.createConnection({
  host:  '127.0.0.1',
  user: 'Shoukat',     // MySQL username
  password: 'Shoukat@44',  // MySQL password
  database: 'comments_db',
  port: 3306
});

// making connection to DB
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

app.use(express.json());
const sessions = {};

// logging in but we are not supposed to use password just returning sessionId
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: 'Username is required' });
  const sessionId = Math.random().toString(36).substr(2, 9);
  sessions[sessionId] = username;
  res.send({ sessionId });
});

// fetching comments
app.get('/api/comments', (req, res) => {
  const query = 'SELECT * FROM comments ORDER BY timestamp DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'Error fetching comments' });
      return;
    }
    res.json(results);
  });
});

// adding new Comments
app.post('/api/comments', (req, res) => {
  const { username, comment } = req.body;
  const query = 'INSERT INTO comments (username, comment) VALUES (?, ?)';

  db.query(query, [username, comment], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ error: 'Error adding comment' });
      return;
    }

    // emitting new comment using socket IO
    const newComment = { id: result.insertId, username, comment, timestamp: new Date() };
    io.emit('newComment', newComment);

    res.status(201).json(newComment);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the comments API!'); 
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
