const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const { amqpServer } = require('./amqpServer');
const { logger } = require('./logger');

const app = express();
const server = createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(cors());
app.use(express.static('public'));

const MAP = {
  x: 10,
  y: 10,
};

var players = [];

io.on('connection', (socket) => {
  players.push(createPlayer(socket.id));

  io.emit('state', players);

  socket.on('player:move', (code) => {
    const player = players.find((p) => p.id === socket.id);
    const moviment = handleKeyDown[code];
    if (!moviment) return;
    moviment(player);
    io.emit('state', players);
  });

  socket.on('disconnect', () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit('state', players);
  });
});

const handleKeyDown = {
  ArrowUp(player) {
    if (player.y <= 0) {
      player.y = MAP.y - 1;
      return;
    }
    player.y = --player.y;
    return player;
  },
  ArrowDown(player) {
    if (player.y >= MAP.y - 1) {
      player.y = 0;
      return;
    }
    player.y = ++player.y;
    return player;
  },
  ArrowLeft(player) {
    if (player.x <= 0) {
      player.x = MAP.x - 1;
      return;
    }
    player.x = --player.x;
    return player;
  },
  ArrowRight(player) {
    if (player.x >= MAP.x - 1) {
      player.x = 0;
      return;
    }
    player.x = ++player.x;
    return player;
  },
};

const createPlayer = (id) => {
  return {
    id,
    x: Math.floor(Math.random() * MAP.x),
    y: Math.floor(Math.random() * MAP.y),
  };
};

server.listen(3000, () => console.log('Server is Running at 3000'));
