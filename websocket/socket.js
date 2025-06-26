const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const messageHandler = require('./handlers');

const clients = new Map(); // Maps userId => ws connection
const tripSubscriptions = new Map();

function  setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  // console.log("inside the connection",wss)
  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const token = params.get('token');
    if (!token) return ws.close(1008, 'Missing token');
    console.log("inside the connectionfuc")
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return ws.close(1008, 'Invalid token');
      debugger
      console.log("the user is",user)
      ws.user = user;
      clients.set(user.id, ws);
      ws.on('message', (data) => {
        messageHandler.handleMessage(ws, data, clients,tripSubscriptions);
      });

      ws.on('close', () => {
        console.log(`User ${user.username} disconnected`);
        clients.delete(user.id);

        // Clean up subscriptions
        for (const [tripId, users] of tripSubscriptions.entries()) {
          users.delete(user.id);
          if (users.size === 0) {
            tripSubscriptions.delete(tripId);
          }
        }
      });
    });
  });
}

module.exports = setupWebSocket;
