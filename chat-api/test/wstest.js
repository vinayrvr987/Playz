const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected to WebSocket server');

  const joinMessage = { type: 'join', room: 'testRoom' };
  ws.send(JSON.stringify(joinMessage));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received message:', data);

  if (data.type === 'history') {
    const message = { type: 'message', email: 'test@test.com', room: 'testRoom', message: 'Hello from client!' };
    ws.send(JSON.stringify(message));
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};