const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['info', 'warning', 'success', 'alert'], 
    default: 'info' 
  },
  targetDistrict: { type: String, default: 'All' }, // Kis district ko dikhana hai
  date: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 7*24*60*60*1000 } // 7 din baad auto-delete
});

module.exports = mongoose.model('Notification', NotificationSchema);