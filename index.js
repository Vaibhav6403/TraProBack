const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require('./database/db');
const router = require('./routes/authRoutes');
const socket = require('./websocket/socket');
const http = require('http')
const WebSocket = require('ws');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectdb();

app.use(express.static(path.join(__dirname, '../frontend-dist')));

const PORT = process.env.PORT || 5000;

app.use('/api/user',router)
app.get('/', (req, res) => {
    console.log("")
    res.send('API is running...')});

const server = http.createServer(app);
socket(server);
// const wss = new WebSocket.Server({ server });
// wss.on('connection', (ws, req) => {
//   // Optional: extract token from req.url
//   console.log('WebSocket client connected');
// });
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

