const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,  // 10 seconds (default is 25000)
  pingTimeout: 5000,    // 5 seconds (default is 5000)
  maxHttpBufferSize: 1e7 // optional, to prevent buffer overflows
});

let messages = []; // In-memory storage

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send chat history to new user
  socket.emit('chat_history', messages);

  // Handle new message
  socket.on('send_message', (data) => {
    messages.push(data);
    io.emit('receive_message', data); // Send to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
