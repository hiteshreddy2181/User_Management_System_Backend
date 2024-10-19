import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import ChatRoom from '../models/ChatRoom.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:7001', // Adjust this to your frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createRoom', async ({ users }) => {
      const roomId = uuidv4(); // Generate a unique room ID

      try {
        // Create and save the chat room in the database
        const chatRoom = new ChatRoom({ roomId, users });
        await chatRoom.save();

        // Join the socket to the room
        users.forEach(userId => {
          socket.join(roomId);
        });

        // Emit a message to the room or to the users
        io.to(roomId).emit('roomCreated', { roomId, users });
      } catch (error) {
        console.error('Error creating room:', error);
      }
    });

    
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

    socket.on('message', (msg) => {
      io.to(msg.roomId).emit('message', msg); // Broadcast message to the room
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`Left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export default initializeSocket;
