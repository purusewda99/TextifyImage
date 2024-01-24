const express = require('express');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.get('/', (req, res) => {
    res.send('TextifyImage API is running...');
});

app.use('/api', imageRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;