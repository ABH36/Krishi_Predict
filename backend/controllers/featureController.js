const LivePrice = require('../models/LivePrice');
const DiseaseReport = require('../models/DiseaseReport');
const MarketListing = require('../models/MarketListing');
const Notification = require('../models/Notification');

// --- 1. COMMUNITY DISEASE RADAR ---
exports.getAlerts = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
        const reports = await DiseaseReport.find({
            district: new RegExp(req.params.district, 'i'),
            date: { $gte: sevenDaysAgo }
        });
        
        const diseaseCounts = {};
        reports.forEach(r => {
            const name = r.disease.split('-').pop().trim(); 
            diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
        });
        
        // Format for Frontend
        const activeAlerts = Object.keys(diseaseCounts)
            .map(d => ({ disease: d, count: diseaseCounts[d] }))
            .sort((a, b) => b.count - a.count);
            
        res.json(activeAlerts);
    } catch (error) { res.status(500).json([]); }
};

// --- 2. KISAN BAZAAR (Selling) ---
exports.addMarketListing = async (req, res) => {
    try {
        await MarketListing.create(req.body);
        res.json({ status: "success", message: "Crop Listed Successfully" });
    } catch (err) { res.status(500).json({ error: "Listing failed" }); }
};

exports.getMarketListings = async (req, res) => {
    try {
        const items = await MarketListing.find({ 
            district: new RegExp(req.params.district, 'i'),
            status: 'active'
        }).sort({ date: -1 });
        res.json(items);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
};

// --- 3. LIVE PRICE REPORTER ---
exports.addReport = async (req, res) => {
    try {
        await LivePrice.create(req.body);
        res.json({ status: "success" });
    } catch (err) { res.status(500).json({ error: "Failed" }); }
};

exports.getReports = async (req, res) => {
    try {
        const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
        const reports = await LivePrice.find({
            district: new RegExp(req.params.district, 'i'),
            time: { $gte: oneDayAgo }
        }).sort({ time: -1 }).limit(10);
        res.json(reports);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
};

// --- 4. NOTIFICATIONS ---
exports.getNotifications = async (req, res) => {
    try {
        const messages = await Notification.find().sort({ date: -1 }).limit(20);
        res.json(messages);
    } catch (err) { res.status(500).json([]); }
};