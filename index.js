const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

require('dotenv').config();

// Middleware untuk parsing JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Default route untuk root "/"
app.get('/', (req, res) => {
  res.send('Welcome to Skego API!');
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

