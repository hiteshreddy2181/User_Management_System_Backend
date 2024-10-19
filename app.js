import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/main.js';
import connect from './config/database.js';
import initializeSocket from './middleware/socket.js';

const app = express();
const server = http.createServer(app);
const PORT = 5000;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:7001', // Adjust this to your frontend URL
  methods: ['GET', 'POST']
}));

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize Socket.IO with the server
initializeSocket(server);

// Set up routes
app.use(router);

// Connect to the database
connect();

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
