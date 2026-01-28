const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// ✅ Render automatically sets PORT
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'https://krishi-predict.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/apiRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('KrishiPredict Backend is Live 🚜');
});

// ❌ URL mat do, sirf PORT
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
