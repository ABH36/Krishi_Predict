const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// 1. Config & DB
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// 2. Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Routes Mapping
// Auth Routes (Already existing file)
app.use('/api/auth', require('./routes/auth'));
// Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// API Routes (ML + Features) - Mounted on '/api' to keep frontend URLs same
app.use('/api', require('./routes/apiRoutes'));

// 4. Test Route
app.get('/', (req, res) => res.send('KrishiPredict Backend is Ready & Structured! 🚜'));

// 5. Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running cleanly on http://0.0.0.0:${PORT}`);
});