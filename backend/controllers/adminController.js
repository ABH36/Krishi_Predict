const User = require('../models/User');
const DiseaseReport = require('../models/DiseaseReport');
const MarketListing = require('../models/MarketListing');
const Notification = require('../models/Notification');

// 1. Dashboard Stats
exports.getStats = async (req, res) => {
    try {
        const users = await User.countDocuments();
        const reports = await DiseaseReport.countDocuments();
        const listings = await MarketListing.countDocuments(); // Rentals ki jagah Listings
        
        // Fake Activity Log for UI
        const recentActivity = [
            { text: "System check complete", time: "Just now" },
            { text: `Total ${users} farmers registered`, time: "Today" }
        ];
        
        res.json({ users, reports, listings, recentActivity });
    } catch (err) { res.status(500).json({ error: "Stats failed" }); }
};

// 2. User Management
exports.getUsers = async (req, res) => {
    const users = await User.find().sort({ created_at: -1 }).limit(100);
    res.json(users);
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
};

// 3. Disease Reports Control
exports.getReports = async (req, res) => {
    const reports = await DiseaseReport.find().sort({ date: -1 }).limit(100);
    res.json(reports);
};

exports.deleteReport = async (req, res) => {
    await DiseaseReport.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
};

// 4. Market Listings Control (Kisan Bazaar)
exports.getListings = async (req, res) => {
    const items = await MarketListing.find().sort({ date: -1 }).limit(100);
    res.json(items);
};

exports.deleteListing = async (req, res) => {
    await MarketListing.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
};

// 5. Broadcast (Send Notification)
exports.broadcast = async (req, res) => {
    const { message } = req.body;
    try {
        await Notification.create({
            title: "📢 Admin Notice",
            message: message,
            type: "info"
        });
        res.json({ status: "sent", count: "All Users" });
    } catch (e) {
        res.status(500).json({ error: "Failed" });
    }
};