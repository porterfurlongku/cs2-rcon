const express = require('express');
const { Rcon } = require('rcon-client');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// RCON connection configuration
const rconConfig = {
  host: process.env.RCON_HOST || 'localhost',
  port: parseInt(process.env.RCON_PORT || '27015'),
  password: process.env.RCON_PASSWORD || 'your_rcon_password_here'
};

// Preset commands
const presetCommands = {
  'Change to Dust2': 'changelevel de_dust2',
  'Change to Mirage': 'changelevel de_mirage',
  'Change to Inferno': 'changelevel de_inferno',
  'Restart Match': 'mp_restartgame 1',
  'List Players': 'status',
  'Enable Practice Mode': 'sv_cheats 1; mp_limitteams 0; mp_autoteambalance 0; mp_roundtime 60; mp_freezetime 0; sv_infinite_ammo 1',
  'Disable Practice Mode': 'sv_cheats 0; mp_limitteams 1; mp_autoteambalance 1; mp_roundtime 1.92; mp_freezetime 6; sv_infinite_ammo 0'
};

let rcon = null;

async function connectRcon() {
  try {
    rcon = new Rcon(rconConfig);
    await rcon.connect();
    console.log('Connected to RCON');
    
    // Reconnect on disconnect
    rcon.on('end', () => {
      console.log('RCON connection ended, attempting to reconnect...');
      setTimeout(connectRcon, 5000);
    });
  } catch (error) {
    console.error('Failed to connect to RCON:', error);
    setTimeout(connectRcon, 5000);
  }
}

// Initialize RCON connection
connectRcon();

// Update player count every 10 seconds
setInterval(async () => {
  if (rcon && rcon.authenticated) {
    try {
      const response = await rcon.send('status');
      const players = response.split('\n').filter(line => line.includes('#')).length;
      io.emit('playerCount', players);
    } catch (error) {
      console.error('Error getting player count:', error);
    }
  }
}, 10000);

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send preset commands to client
  socket.emit('presetCommands', presetCommands);

  // Handle RCON commands
  socket.on('rconCommand', async (command) => {
    if (rcon && rcon.authenticated) {
      try {
        const response = await rcon.send(command);
        socket.emit('commandResponse', { command, response });
      } catch (error) {
        socket.emit('commandResponse', { command, error: error.message });
      }
    } else {
      socket.emit('commandResponse', { command, error: 'RCON not connected' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 