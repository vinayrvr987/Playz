const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');

const Chat = require('./models/chatModel');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/playz_chat')
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.error('DB Connection Error:', err.message));

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });
const rooms = {}; // In-memory room data

// Helper function to broadcast messages
function broadcastToRoom(room, message, excludeClient) {
  if (!rooms[room]) return;
  rooms[room].forEach((client) => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// WebSocket connection logic
wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        // Join Room Logic
        currentRoom = data.room;
        if (!rooms[currentRoom]) rooms[currentRoom] = [];
        rooms[currentRoom].push(ws);
        console.log(`User joined room: ${currentRoom}`);

        // Send chat history
        const history = await Chat.find({ room: currentRoom }).sort({ timestamp: 1 }).limit(100);
        ws.send(JSON.stringify({ type: 'history', history }));

      } else if (data.type === 'message') {
        // Handle New Message
        if (!currentRoom) {
          ws.send(JSON.stringify({ type: 'error', message: 'Join a room before sending messages' }));
          return;
        }

        const chatMessage = { email: data.email, message: data.message, room: currentRoom };
        const savedChat = await new Chat(chatMessage).save();

        // Broadcast the message to the room
        broadcastToRoom(currentRoom, { type: 'new_message', chatMessage }, ws);

      } else if (data.type === 'sync') {
        // Sync Time Logic
        const { time } = data;
        broadcastToRoom(currentRoom, { type: 'sync', time }, ws);
      }
    } catch (err) {
      console.error('Error processing message:', err.message);
      ws.send(JSON.stringify({ type: 'error', message: 'An error occurred. Please try again.' }));
    }
  });

  ws.on('close', () => {
    if (currentRoom) {
      rooms[currentRoom] = rooms[currentRoom].filter((client) => client !== ws);
      if (rooms[currentRoom].length === 0) {
        delete rooms[currentRoom]; // Clean up empty rooms
      }
    }
  });
});

// Graceful shutdown logic
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.clients.forEach((client) => client.close());
  process.exit();
});

console.log('WebSocket server running on ws://localhost:8080');
