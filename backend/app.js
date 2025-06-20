const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const fileUpload = require('express-fileupload');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max-file-size
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    debug: process.env.NODE_ENV === 'development'
}));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch((err) => {
  console.error('MongoDB Atlas connection error:', err);
  process.exit(1); // Exit if we can't connect to the database
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a chat room (order-specific)
  socket.on('join_chat', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      const { sender, receiver, content, orderId } = messageData;
      const Message = require('./models/Message');
      
      // Save message to database
      const message = new Message({
        sender,
        receiver,
        content,
        orderId
      });
      await message.save();

      // Emit message to room
      io.to(`order_${orderId}`).emit('new_message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 