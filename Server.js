const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (name) => {
    socket.username = name;
    io.emit('message', { user: 'System', text: `${name} joined the chat` });
  });

  socket.on('sendMessage', (text) => {
    io.emit('message', { user: socket.username, text });
  });

  socket.on('disconnect', () => {
    io.emit('message', { user: 'System', text: `${socket.username} left the chat` });
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
