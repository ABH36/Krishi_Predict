const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 1. Dashboard Statistics
router.get('/stats', adminController.getStats);

// 2. User Management
router.get('/users', adminController.getUsers);
router.delete('/user/:id', adminController.deleteUser);

// 3. Disease Reports Control
router.get('/reports', adminController.getReports);
router.delete('/report/:id', adminController.deleteReport);

// 4. Kisan Bazaar Listings Control 
router.get('/listings', adminController.getListings);
router.delete('/listing/:id', adminController.deleteListing);

// 5. Broadcast System
router.post('/broadcast', adminController.broadcast);

module.exports = router;