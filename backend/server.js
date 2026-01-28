const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// 1. Config & DB
const app = express();
const PORT = process.env.CLIENT_URL;
connectDB();

// 2. Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Routes Mapping
// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// API Routes (ML + Features)
app.use('/api', require('./routes/apiRoutes'));

// 4. Test Route
app.get('/', (req, res) => 
    res.send('KrishiPredict Backend is Ready & Structured! 🚜')
);

// 5. Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running cleanly on http://0.0.0.0:${PORT}`);
});
