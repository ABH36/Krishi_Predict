const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const featureController = require('../controllers/featureController');

// --- 1. AI / ML ROUTES ---
// Price Prediction (XGBoost)
router.post('/predict', mlController.predictPrice);

// Disease Detection (TensorFlow)
router.post('/disease/detect', mlController.detectDisease);

// Gemini Chatbot
router.post('/chat', mlController.chatWithAI);


// --- 2. FEATURE ROUTES ---

// Community Disease Radar (Alerts)
router.get('/alerts/:district', featureController.getAlerts);

// Kisan Bazaar (Sell & Buy)
router.post('/market/sell', featureController.addMarketListing);
router.get('/market/list/:district', featureController.getMarketListings);

// Live Price Reporter (Crowdsource)
router.post('/report/add', featureController.addReport);
router.get('/report/recent/:district', featureController.getReports);

// Notification Center
router.get('/notifications', featureController.getNotifications);

module.exports = router;