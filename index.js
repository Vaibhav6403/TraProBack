const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require('./database/db');
const router = require('./routes/authRoutes');
const setupWebSocket = require('./websocket/socket');
const http = require('http');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectdb();

// API routes
app.use('/api/user', router);
 console.log(path.join(__dirname, './frontend-dist'))
  console.log(path.join(__dirname, './frontend-dist', 'index.html'))
// Serve static frontend files
app.use(express.static(path.join(__dirname, './frontend-dist')));

// SPA fallback route — serve index.html for any other requests (except API/static)

// Optional: simple health check route for API root
app.get('/api', (req, res) => {
    res.send('API is running...');
});
app.get('/', (req, res) => {
    console.log(path.join(__dirname, './frontend-dist', 'index.html'))
  res.sendFile(path.join(__dirname, './frontend-dist'));
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocket(server);

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
