require("dotenv").config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API CORRIENDO'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/pets', require('./routes/api/pets'));
app.use('/api/solicitudes', require('./routes/api/solicitudes'));
app.use('/api/billing', require('./routes/api/billing'));
app.use('/api/messages', require('./routes/api/messages'));
app.use('/api/chats', require('./routes/api/chats'));
app.use('/api/settings', require('./routes/api/settings'));

app.use('/uploads', express.static('uploads'));

const PORT = process.env.DEV_PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
  });

  socket.on('sendMessage', ({ chatId, content }) => {
    io.to(chatId).emit('message', { chatId, content });
  });

  socket.on('disconnect', () => {
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Usa server.listen en lugar de app.listen
server.listen(PORT, () => console.log(`Server abierto en el puerto ${PORT}`));
